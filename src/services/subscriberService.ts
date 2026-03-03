import { AppError } from "../../libs/Errors";
import { createTransport } from "nodemailer";
import { getCount, getMany, getOne, rawQuery, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Bounce from "../models/Bounce";
import SMTPConfig from "../models/SMTPConfig";
import Subscriber from "../models/Subscriber";
import SubscriberList from "../models/SubscriberList";
import { GetManySubscribersOptions } from "../types";
import { ListAction, Order, SubscriberStatus, SubscriptionStatus } from "../types/constants";

const normalizeIds = (values?: number[]): number[] => {
  if (!values) {
    return [];
  }

  return values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
};

const getSubscriberIdsByQuery = async ({
  query,
  list_ids,
  subscription_status,
  all,
}: {
  query?: string;
  list_ids?: number[];
  subscription_status?: SubscriptionStatus;
  all?: boolean;
}): Promise<number[]> => {
  const listIds = normalizeIds(list_ids);

  if (!all && !query && listIds.length === 0 && !subscription_status) {
    return [];
  }

  let sql = "SELECT DISTINCT subscribers.id FROM subscribers subscribers WHERE subscribers.is_deleted = false";
  if (listIds.length > 0 || subscription_status) {
    sql += ` AND EXISTS (
      SELECT 1 FROM subscriber_lists sl
      WHERE sl.subscriber_id = subscribers.id
        AND sl.is_deleted = false
        ${listIds.length > 0 ? `AND sl.list_id IN (${listIds.join(",")})` : ""}
        ${subscription_status ? `AND sl.status = '${subscription_status}'` : ""}
    )`;
  }

  if (!all && query) {
    sql += ` AND (${query})`;
  }

  const rows = (await rawQuery(sql)) as Array<{ id: number | string }>;
  return rows.map((row) => Number(row.id)).filter((id) => Number.isFinite(id));
};

const GetManySubscribers = async ({
  query,
  list_id,
  list_ids,
  subscription_status,
  page = 1,
  per_page = 50,
  order_by = "created_at",
  order = Order.desc,
}: GetManySubscribersOptions): Promise<
  APIResponse<{ results: Subscriber[]; query: string; total: number; per_page: number | "all"; page: number }>
> => {
  const listIds = normalizeIds([...(list_id || []), ...(list_ids || [])]);
  const limit = per_page === "all" ? undefined : per_page;
  let total = 0;

  let filteredIds: number[] = [];
  if (query || listIds.length > 0 || subscription_status) {
    filteredIds = await getSubscriberIdsByQuery({
      query,
      list_ids: listIds,
      subscription_status,
    });
    total = filteredIds.length;
    if (filteredIds.length === 0) {
      return {
        data: {
          results: [],
          query: query || "",
          total: 0,
          per_page,
          page,
        },
        message: "Subscribers retrieved successfully",
        success: true,
      };
    }
  } else {
    total = await getCount("Subscriber", {});
  }

  const subscribers = (await getMany("Subscriber", {
    where: {
      ...(filteredIds.length > 0
        ? {
            "id IN": filteredIds,
          }
        : {}),
    },
    relations: { subscriberLists: true },
    limit,
    skip: limit ? (page - 1) * limit : undefined,
    order: { [order_by]: order },
  })) as Subscriber[];

  return {
    data: {
      results: subscribers,
      query: query || "",
      total,
      per_page,
      page,
    },
    message: "Subscribers retrieved successfully",
    success: true,
  };
};

const GetOneSubscriber = async (subscriberId: number): Promise<APIResponse<Subscriber>> => {
  const subscriber = (await getOne("Subscriber", {
    where: {
      id: subscriberId,
    },
    relations: { subscriberLists: true },
  })) as Subscriber;

  return {
    data: subscriber,
    message: "Subscriber retrieved successfully",
    success: true,
  };
};

const GetSubscriberBounceRecords = async (subscriberId: number): Promise<APIResponse<Bounce[]>> => {
  const bounceRecords = (await getMany("Bounce", {
    where: {
      subscriber_id: subscriberId,
    },
    order: { created_at: "DESC" },
  })) as Bounce[];

  return {
    data: bounceRecords,
    message: "Subscriber bounce records retrieved successfully",
    success: true,
  };
};

const CreateSubscriber = async (
  body: Partial<Subscriber>,
  listIds?: number[],
  preConfirmSubscriptions: boolean = false,
): Promise<APIResponse<Subscriber>> => {
  const existingEmail = await getCount("Subscriber", {
    where: {
      email: body.email,
    },
  });

  if (existingEmail > 0) {
    throw new AppError("Email Already Exists", 409);
  }

  const newSubscriber = (await saveData<Subscriber>("Subscriber", {
    ...body,
  })) as Subscriber;

  let subscriberLists: SubscriberList[] = [];
  if (listIds && listIds.length > 0) {
    subscriberLists = await Promise.all(
      listIds.map(
        (list_id) =>
          saveData("SubscriberList", {
            subscriber_id: newSubscriber.id,
            list_id,
            status: preConfirmSubscriptions
              ? SubscriptionStatus.confirmed
              : SubscriptionStatus.unconfirmed,
            meta: {},
          }) as Promise<SubscriberList>,
      ),
    );
  }

  return {
    data: { ...newSubscriber, subscriberLists },
    message: "Subscriber Created Successfully",
    success: true,
  };
};

const UpdateSubscriber = async (
  body: Partial<Subscriber>,
  listIds?: number[],
  preConfirmSubscriptions: boolean = false,
): Promise<APIResponse<Subscriber>> => {
  const updatedSubscriber = (await saveData("Subscriber", {
    ...body,
  })) as Subscriber;

  let updatedSubscriberLists: SubscriberList[] = [];
  if (listIds !== undefined) {
    const existingLists = (await getMany("SubscriberList", {
      where: { subscriber_id: updatedSubscriber.id },
    })) as SubscriberList[];

    await Promise.all(
      existingLists.map(async (subscriberList) => {
        await saveData("SubscriberList", {
          id: subscriberList.id,
          is_deleted: true,
        });
      }),
    );

    updatedSubscriberLists = await Promise.all(
      listIds.map(
        (list_id) =>
          saveData("SubscriberList", {
            subscriber_id: updatedSubscriber.id,
            list_id,
            status: preConfirmSubscriptions
              ? SubscriptionStatus.confirmed
              : SubscriptionStatus.unconfirmed,
            meta: {},
          }) as Promise<SubscriberList>,
      ),
    );
  }

  const subscriber = (await getOne("Subscriber", {
    where: { id: updatedSubscriber.id },
    relations: { subscriberLists: true },
  })) as Subscriber;

  return {
    data: { ...subscriber, subscriberLists: subscriber.subscriberLists || updatedSubscriberLists },
    message: "Subscriber Updated Successfully",
    success: true,
  };
};

const DeleteOneSubscriber = async (subscriberId: number): Promise<APIResponse<boolean>> => {
  await saveData("Subscriber", {
    id: subscriberId,
    is_deleted: true,
  });

  return {
    data: true,
    message: "Subscriber Deleted Successfully",
    success: true,
  };
};

const DeleteManySubscriber = async (subscriberIds: number[]): Promise<APIResponse<boolean>> => {
  if (!subscriberIds || subscriberIds.length === 0) {
    return {
      data: true,
      message: "Subscribers Deleted Successfully",
      success: true,
    };
  }

  await Promise.all(
    subscriberIds.map(async (subscriberId) => {
      await saveData("Subscriber", {
        id: subscriberId,
        is_deleted: true,
      });
    }),
  );

  return {
    data: true,
    message: "Subscribers Deleted Successfully",
    success: true,
  };
};

const DeleteSubscriberBounceRecords = async (
  subscriberId: number,
): Promise<APIResponse<boolean>> => {
  const bounces = (await getMany("Bounce", {
    where: { subscriber_id: subscriberId },
  })) as Bounce[];

  await Promise.all(
    bounces.map(async (bounce) => {
      await saveData("Bounce", {
        id: bounce.id,
        is_deleted: true,
      });
    }),
  );

  return {
    data: true,
    message: "Subscriber Bounce Records Deleted Successfully",
    success: true,
  };
};

const ModifySubscriberList = async ({
  ids,
  subscriber_ids,
  target_list_ids,
  action,
  status,
}: {
  ids?: number[];
  subscriber_ids?: number[];
  target_list_ids: number[];
  action: ListAction;
  status?: SubscriptionStatus;
}): Promise<APIResponse<boolean>> => {
  const resolvedSubscriberIds = normalizeIds(ids || subscriber_ids);
  if (resolvedSubscriberIds.length === 0) {
    throw new AppError("No subscriber IDs provided", 400);
  }

  if (action === ListAction.add && !status) {
    throw new AppError("Status is required for add action", 409);
  }

  const upsertSubscriberList = async (
    subscriber_id: number,
    list_id: number,
    nextStatus: SubscriptionStatus,
  ) => {
    const existing = (await getOne("SubscriberList", {
      where: { subscriber_id, list_id },
      withDeleted: true,
    })) as SubscriberList | null;

    if (existing) {
      await saveData("SubscriberList", {
        id: existing.id,
        subscriber_id,
        list_id,
        status: nextStatus,
        meta: existing.meta || {},
        is_deleted: false,
      });
      return;
    }

    await saveData("SubscriberList", {
      subscriber_id,
      list_id,
      status: nextStatus,
      meta: {},
      is_deleted: false,
    });
  };

  await Promise.all(
    resolvedSubscriberIds.map(async (subscriber_id) => {
      await Promise.all(
        target_list_ids.map(async (list_id) => {
          switch (action) {
            case ListAction.add:
              await upsertSubscriberList(subscriber_id, list_id, status as SubscriptionStatus);
              break;

            case ListAction.remove: {
              const existing = (await getOne("SubscriberList", {
                where: { subscriber_id, list_id },
              })) as SubscriberList | null;
              if (existing) {
                await saveData("SubscriberList", {
                  id: existing.id,
                  is_deleted: true,
                });
              }
              break;
            }

            case ListAction.unsubscribe:
              await upsertSubscriberList(subscriber_id, list_id, SubscriptionStatus.unsubscribed);
              break;
          }
        }),
      );
    }),
  );

  return {
    data: true,
    message: "Subscriber List Membership Updated Successfully",
    success: true,
  };
};

const BlocklistOneSubscriber = async (subscriberId: number): Promise<APIResponse<boolean>> => {
  await saveData("Subscriber", {
    id: subscriberId,
    status: SubscriberStatus.blocklisted,
  });

  return {
    data: true,
    message: "Subscriber Blocklisted Successfully",
    success: true,
  };
};

const BlockListManySubscribers = async ({
  ids,
  subscriber_ids,
}: {
  ids?: number[];
  subscriber_ids?: number[];
}): Promise<APIResponse<boolean>> => {
  const resolvedIds = normalizeIds(ids || subscriber_ids);
  if (resolvedIds.length === 0) {
    return {
      data: true,
      message: "Subscribers Blocklisted Successfully",
      success: true,
    };
  }

  await Promise.all(
    resolvedIds.map(async (subscriber_id) => {
      await saveData("Subscriber", {
        id: subscriber_id,
        status: SubscriberStatus.blocklisted,
      });
    }),
  );

  return {
    data: true,
    message: "Subscribers Blocklisted Successfully",
    success: true,
  };
};

const GetSubscriberActivity = async (subscriberId: number): Promise<APIResponse<Record<string, unknown>>> => {
  const views = (await getMany("CampaignView", {
    where: { subscriber_id: subscriberId },
    order: { created_at: "DESC" },
    limit: 100,
  })) as unknown[];
  const clicks = (await getMany("LinkClick", {
    where: { subscriber_id: subscriberId },
    order: { created_at: "DESC" },
    limit: 100,
  })) as unknown[];

  return {
    data: { campaign_views: views, link_clicks: clicks },
    message: "Subscriber Activity Retrieved Successfully",
    success: true,
  };
};

const ExportSubscriberData = async (subscriberId: number): Promise<APIResponse<Record<string, unknown>>> => {
  const subscriber = (await getOne("Subscriber", {
    where: { id: subscriberId },
  })) as Subscriber;
  const lists = (await getMany("SubscriberList", {
    where: { subscriber_id: subscriberId },
  })) as SubscriberList[];
  const bounces = (await getMany("Bounce", {
    where: { subscriber_id: subscriberId },
  })) as Bounce[];

  return {
    data: { profile: subscriber, subscriptions: lists, bounces },
    message: "Subscriber Export Retrieved Successfully",
    success: true,
  };
};

const resolveSMTP = async () => {
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

const tlsTypeToOptions = (tlsType?: string) => {
  if (tlsType === "TLS") {
    return { secure: true, requireTLS: false, ignoreTLS: false };
  }
  if (tlsType === "STARTTLS") {
    return { secure: false, requireTLS: true, ignoreTLS: false };
  }
  return { secure: false, requireTLS: false, ignoreTLS: true };
};

const SendSubscriberOptin = async (subscriberId: number): Promise<APIResponse<boolean>> => {
  const subscriber = (await getOne("Subscriber", {
    where: { id: subscriberId, is_deleted: false },
  })) as Subscriber | null;

  if (!subscriber) {
    throw new AppError("Subscriber not found", 404);
  }

  const smtp = await resolveSMTP();
  const tlsOptions = tlsTypeToOptions(smtp.tls_type);
  const transport = createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
    authMethod: smtp.auth_protocol.toUpperCase(),
    secure: tlsOptions.secure,
    requireTLS: tlsOptions.requireTLS,
    ignoreTLS: tlsOptions.ignoreTLS,
    tls: {
      rejectUnauthorized: !smtp.tls_skip_verify,
    },
    name: smtp.hello_hostname,
  });

  await transport.sendMail({
    from: smtp.username,
    to: subscriber.email,
    subject: "Confirm your subscription",
    html: `<p>Hello ${subscriber.name || subscriber.email},</p><p>Your subscription confirmation has been requested.</p>`,
  });

  return {
    data: true,
    message: "Opt-in email sent successfully",
    success: true,
  };
};

const DeleteSubscribersByQuery = async ({
  query,
  list_ids,
  all,
}: {
  query?: string;
  list_ids?: number[];
  all?: boolean;
}): Promise<APIResponse<boolean>> => {
  const ids = await getSubscriberIdsByQuery({ query, list_ids, all });
  return DeleteManySubscriber(ids);
};

const BlocklistSubscribersByQuery = async ({
  query,
  list_ids,
  all,
}: {
  query?: string;
  list_ids?: number[];
  all?: boolean;
}): Promise<APIResponse<boolean>> => {
  const ids = await getSubscriberIdsByQuery({ query, list_ids, all });
  return BlockListManySubscribers({ ids, subscriber_ids: ids });
};

const ManageSubscriberListsByQuery = async ({
  ids,
  subscriber_ids,
  target_list_ids,
  action,
  status,
}: {
  ids?: number[];
  subscriber_ids?: number[];
  target_list_ids: number[];
  action: ListAction;
  status?: SubscriptionStatus;
}): Promise<APIResponse<boolean>> => {
  return ModifySubscriberList({ ids, subscriber_ids, target_list_ids, action, status });
};

const ExportSubscribers = async (): Promise<APIResponse<Subscriber[]>> => {
  const subscribers = (await getMany("Subscriber", {
    where: {},
    order: { created_at: "DESC" },
  })) as Subscriber[];

  return {
    data: subscribers,
    message: "Subscribers Export Retrieved Successfully",
    success: true,
  };
};

export {
  GetManySubscribers,
  GetOneSubscriber,
  GetSubscriberBounceRecords,
  CreateSubscriber,
  UpdateSubscriber,
  DeleteOneSubscriber,
  DeleteManySubscriber,
  ModifySubscriberList,
  BlocklistOneSubscriber,
  BlockListManySubscribers,
  DeleteSubscriberBounceRecords,
  GetSubscriberActivity,
  ExportSubscriberData,
  SendSubscriberOptin,
  DeleteSubscribersByQuery,
  BlocklistSubscribersByQuery,
  ManageSubscriberListsByQuery,
  ExportSubscribers,
};
