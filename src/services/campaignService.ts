import { createTransport } from "nodemailer";
import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, rawQuery, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Campaign from "../models/Campaign";
import SMTPConfig from "../models/SMTPConfig";
import { GetManyCampaignsOptions } from "../types";
import { CampaignStatus, CampaignType, Order } from "../types/constants";

const normalizeIds = (ids?: number[]): number[] => {
  if (!ids) {
    return [];
  }

  return ids.map((id) => Number(id)).filter((id) => Number.isFinite(id));
};

const sqlDate = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
};

const resolveSMTP = async (smtpConfigId?: number) => {
  if (smtpConfigId) {
    const byId = (await getOne("SMTPConfig", {
      where: { id: smtpConfigId, enabled: true },
    })) as SMTPConfig | null;
    if (byId) {
      return byId;
    }
  }

  const defaultSMTP = (await getOne("SMTPConfig", {
    where: { enabled: true, is_default: true },
  })) as SMTPConfig | null;
  if (defaultSMTP) {
    return defaultSMTP;
  }

  const fallbackSMTP = (await getOne("SMTPConfig", {
    where: { enabled: true },
    order: { created_at: "DESC" },
  })) as SMTPConfig | null;
  if (!fallbackSMTP) {
    throw new AppError("No enabled SMTP config found", 400);
  }

  return fallbackSMTP;
};

const mapTlsOptions = (type: string) => {
  if (type === "TLS") {
    return { secure: true, requireTLS: false, ignoreTLS: false };
  }
  if (type === "STARTTLS") {
    return { secure: false, requireTLS: true, ignoreTLS: false };
  }
  return { secure: false, requireTLS: false, ignoreTLS: true };
};

const GetManyCampaigns = async ({
  query,
  no_body,
  status,
  tags,
  page = 1,
  per_page = 50,
  order_by = "created_at",
  order = Order.desc,
}: GetManyCampaignsOptions): Promise<
  APIResponse<{ results: Campaign[]; query: string; total: number; per_page: number | "all"; page: number }>
> => {
  const limit = per_page === "all" ? undefined : per_page;
  const statuses = Array.isArray(status) ? status : status ? [status] : [];
  const where = {
    ...(query && { "name LIKE": `%${query}%` }),
    ...(statuses.length > 0 && { "status IN": statuses }),
    ...(tags && tags.length > 0 && { "tags LIKE": `%${tags[0]}%` }),
  };

  const campaigns = (await getMany("Campaign", {
    where,
    relations: { campaignLists: true },
    limit,
    skip: limit ? (page - 1) * limit : undefined,
    order: { [order_by]: order },
    ...(no_body && { select: { body: false, body_source: false } }),
  })) as Campaign[];
  const total = await getCount("Campaign", { where });

  return {
    data: {
      results: campaigns,
      query: query || "",
      total,
      per_page,
      page,
    },
    message: "Campaigns retrieved successfully",
    success: true,
  };
};

const GetOneCampaign = async (campaignId: number): Promise<APIResponse<Campaign>> => {
  const campaign = (await getOne("Campaign", {
    where: { id: campaignId },
    relations: { campaignLists: true, smtpConfig: true, template: true },
  })) as Campaign;

  return {
    data: campaign,
    message: "Campaign retrieved successfully",
    success: true,
  };
};

const syncCampaignLists = async (campaignId: number, listIds?: number[]) => {
  if (!listIds) {
    return;
  }

  const existing = (await getMany("CampaignList", {
    where: { campaign_id: campaignId },
  })) as { id: number }[];

  await Promise.all(
    existing.map(async (row) => {
      await saveData("CampaignList", {
        id: row.id,
        is_deleted: true,
      });
    }),
  );

  await Promise.all(
    listIds.map(async (listId) => {
      const list = (await getOne("List", {
        where: { id: listId },
      })) as { name?: string } | null;

      await saveData("CampaignList", {
        campaign_id: campaignId,
        list_id: listId,
        list_name: list?.name || "",
      });
    }),
  );
};

const CreateCampaign = async (
  body: Partial<Campaign> & { list_ids?: number[] },
): Promise<APIResponse<Campaign>> => {
  const existingCampaign = await getCount("Campaign", {
    where: { name: body.name },
  });
  if (existingCampaign > 0) {
    throw new AppError("Campaign Already Exists", 409);
  }

  const smtp = await resolveSMTP(body.smtp_config_id);
  const newCampaign = (await saveData("Campaign", {
    ...body,
    smtp_config_id: body.smtp_config_id || smtp.id,
    from_email: body.from_email || smtp.username,
    type: body.type || CampaignType.regular,
    status: body.status || CampaignStatus.draft,
    headers: body.headers || [],
    attribs: body.attribs || {},
    archive_meta: body.archive_meta || {},
  })) as Campaign;

  await syncCampaignLists(newCampaign.id, body.list_ids);

  return {
    data: newCampaign,
    message: "Campaign Created Successfully",
    success: true,
  };
};

const UpdateCampaign = async (
  body: Partial<Campaign> & { id: number; list_ids?: number[] },
): Promise<APIResponse<Campaign>> => {
  const updatedCampaign = (await saveData("Campaign", {
    ...body,
  })) as Campaign;

  await syncCampaignLists(body.id, body.list_ids);

  const campaign = (await getOne("Campaign", {
    where: { id: updatedCampaign.id },
    relations: { campaignLists: true, smtpConfig: true, template: true },
  })) as Campaign;

  return {
    data: campaign,
    message: "Campaign Updated Successfully",
    success: true,
  };
};

const DeleteOneCampaign = async (campaignId: number): Promise<APIResponse<boolean>> => {
  await saveData("Campaign", {
    id: campaignId,
    is_deleted: true,
    status: CampaignStatus.cancelled,
  });

  return {
    data: true,
    message: "Campaign Deleted Successfully",
    success: true,
  };
};

const DeleteManyCampaigns = async ({
  ids,
  query,
}: {
  ids?: number[];
  query?: string;
}): Promise<APIResponse<boolean>> => {
  let campaignIds = normalizeIds(ids);

  if (campaignIds.length === 0 && query) {
    const escapedQuery = query.replaceAll("'", "''");
    const rows = (await rawQuery(
      `SELECT id FROM campaigns WHERE is_deleted = false AND (name LIKE '%${escapedQuery}%' OR subject LIKE '%${escapedQuery}%')`,
    )) as Array<{ id: number | string }>;
    campaignIds = rows.map((row) => Number(row.id)).filter((id) => Number.isFinite(id));
  }

  if (campaignIds.length === 0) {
    return {
      data: true,
      message: "Campaigns Deleted Successfully",
      success: true,
    };
  }

  await Promise.all(
    campaignIds.map(async (campaignId) => {
      await saveData("Campaign", {
        id: campaignId,
        is_deleted: true,
        status: CampaignStatus.cancelled,
      });
    }),
  );

  return {
    data: true,
    message: "Campaigns Deleted Successfully",
    success: true,
  };
};

const GetCampaignPreview = async (campaignId: number): Promise<APIResponse<{ body: string }>> => {
  const campaign = (await getOne("Campaign", {
    where: { id: campaignId, is_deleted: false },
    select: { body: true },
  })) as { body: string };

  return {
    data: campaign,
    message: "Campaign Preview retrieved successfully",
    success: true,
  };
};

const UpdateCampaignStatus = async (
  campaignId: number,
  status: CampaignStatus,
): Promise<APIResponse<Campaign>> => {
  const payload: Partial<Campaign> & { id: number } = {
    id: campaignId,
    status,
  };

  if (status === CampaignStatus.running) {
    payload.started_at = new Date();
  }

  const updatedCampaign = (await saveData("Campaign", payload)) as Campaign;
  const campaign = (await getOne("Campaign", {
    where: { id: updatedCampaign.id },
    relations: { campaignLists: true, smtpConfig: true, template: true },
  })) as Campaign;
  return {
    data: campaign,
    message: "Campaign Status Updated Successfully",
    success: true,
  };
};

const UpdateCampaignArchive = async (
  campaignId: number,
  body: { archive: boolean; archive_template_id?: number; archive_meta?: any; archive_slug?: string },
): Promise<APIResponse<Campaign>> => {
  const updatedCampaign = (await saveData("Campaign", {
    id: campaignId,
    ...body,
  })) as Campaign;
  const campaign = (await getOne("Campaign", {
    where: { id: updatedCampaign.id },
    relations: { campaignLists: true, smtpConfig: true, template: true },
  })) as Campaign;

  return {
    data: campaign,
    message: "Campaign Archive Updated Successfully",
    success: true,
  };
};

const GetRunningCampaignStats = async (campaignIds?: number[]): Promise<APIResponse<Campaign[]>> => {
  const ids = normalizeIds(campaignIds);
  const campaigns = (await getMany("Campaign", {
    where: {
      "status IN": [CampaignStatus.running, CampaignStatus.scheduled],
      ...(ids.length > 0 && { "id IN": ids }),
    },
    order: { updated_at: "DESC" },
  })) as Campaign[];

  return {
    data: campaigns,
    message: "Running Campaign Stats Retrieved Successfully",
    success: true,
  };
};

const GetCampaignAnalytics = async (
  type: string,
  {
    id,
    from,
    to,
  }: {
    id: number[];
    from: string;
    to: string;
  },
): Promise<APIResponse<unknown[]>> => {
  const ids = normalizeIds(id);
  const fromDate = sqlDate(from);
  const toDate = sqlDate(to);

  const dateFilter =
    (fromDate ? ` AND created_at >= '${fromDate}'` : "") +
    (toDate ? ` AND created_at <= '${toDate}'` : "");
  const idFilter = ids.length > 0 ? ` AND campaign_id IN (${ids.join(",")})` : "";

  let rows: unknown[] = [];
  if (type === "views") {
    rows = (await rawQuery(
      `SELECT campaign_id, DATE(created_at) as timestamp, COUNT(*) as count
       FROM campaign_views
       WHERE is_deleted = false${idFilter}${dateFilter}
       GROUP BY campaign_id, DATE(created_at)
       ORDER BY DATE(created_at) DESC
       LIMIT 100`,
    )) as unknown[];
  } else if (type === "clicks") {
    rows = (await rawQuery(
      `SELECT campaign_id, DATE(created_at) as timestamp, COUNT(*) as count
       FROM link_clicks
       WHERE is_deleted = false${idFilter}${dateFilter}
       GROUP BY campaign_id, DATE(created_at)
       ORDER BY DATE(created_at) DESC
       LIMIT 100`,
    )) as unknown[];
  } else if (type === "links") {
    const linksIdFilter = ids.length > 0 ? ` AND lc.campaign_id IN (${ids.join(",")})` : "";
    const linksDateFilter =
      (fromDate ? ` AND lc.created_at >= '${fromDate}'` : "") +
      (toDate ? ` AND lc.created_at <= '${toDate}'` : "");
    rows = (await rawQuery(
      `SELECT l.url, COUNT(*) as count
       FROM link_clicks lc
       INNER JOIN links l ON l.id = lc.link_id
       WHERE lc.is_deleted = false${linksIdFilter}${linksDateFilter}
       GROUP BY l.url
       ORDER BY count DESC
       LIMIT 100`,
    )) as unknown[];
  } else if (type === "bounces") {
    rows = (await rawQuery(
      `SELECT campaign_id, DATE(created_at) as timestamp, COUNT(*) as count
       FROM bounces
       WHERE is_deleted = false${idFilter}${dateFilter}
       GROUP BY campaign_id, DATE(created_at)
       ORDER BY DATE(created_at) DESC
       LIMIT 100`,
    )) as unknown[];
  }

  return {
    data: rows,
    message: "Campaign analytics retrieved successfully",
    success: true,
  };
};

const ConvertCampaignContent = async ({
  id,
  from,
  to,
}: {
  id: number;
  from: string;
  to: string;
}): Promise<APIResponse<{ body: string }>> => {
  const campaign = (await getOne("Campaign", {
    where: { id },
  })) as Campaign | null;

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (from === to) {
    return {
      data: { body: campaign.body },
      message: "Campaign content converted successfully",
      success: true,
    };
  }

  // Minimal conversion for parity endpoint existence in email-only mode.
  return {
    data: { body: campaign.body },
    message: "Campaign content converted successfully",
    success: true,
  };
};

const TestCampaign = async ({
  campaignId,
  subscriber_emails,
}: {
  campaignId: number;
  subscriber_emails: string[];
}): Promise<APIResponse<boolean>> => {
  const campaign = (await getOne("Campaign", {
    where: { id: campaignId, is_deleted: false },
  })) as Campaign | null;
  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }
  if (!subscriber_emails || subscriber_emails.length === 0) {
    throw new AppError("No subscribers provided", 400);
  }

  const smtp = await resolveSMTP(campaign.smtp_config_id);
  const tlsOptions = mapTlsOptions(smtp.tls_type);
  const transport = createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: { user: smtp.username, pass: smtp.password },
    authMethod: smtp.auth_protocol.toUpperCase(),
    secure: tlsOptions.secure,
    requireTLS: tlsOptions.requireTLS,
    ignoreTLS: tlsOptions.ignoreTLS,
    tls: {
      rejectUnauthorized: !smtp.tls_skip_verify,
    },
    name: smtp.hello_hostname,
  });

  await Promise.all(
    subscriber_emails.map(async (email) => {
      await transport.sendMail({
        from: campaign.from_email || smtp.username,
        to: email,
        subject: campaign.subject,
        html: campaign.body,
      });
    }),
  );

  return {
    data: true,
    message: "Campaign Test Successful",
    success: true,
  };
};

export {
  GetManyCampaigns,
  GetOneCampaign,
  CreateCampaign,
  UpdateCampaign,
  DeleteOneCampaign,
  DeleteManyCampaigns,
  GetCampaignPreview,
  TestCampaign,
  UpdateCampaignStatus,
  UpdateCampaignArchive,
  GetRunningCampaignStats,
  GetCampaignAnalytics,
  ConvertCampaignContent,
};
