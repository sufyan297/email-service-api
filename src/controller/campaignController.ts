import { t } from "elysia";
import type { AppInstance } from "../../index";
import {
  CampaignContentDTO,
  ChangeCampaignStatusDTO,
  CreateCampaignDTO,
  DeleteManyCampaignsDTO,
  GetCampaignAnalyticsDTO,
  GetManyCampaignsDTO,
  GetRunningCampaignStatsDTO,
  PublishCampaignDTO,
  TestCampaignDTO,
  UpdateCampaignDTO,
} from "../dto/campaign";
import AdminAuth from "../middleware/admin_auth";
import {
  ConvertCampaignContent,
  CreateCampaign,
  DeleteManyCampaigns,
  DeleteOneCampaign,
  GetCampaignAnalytics,
  GetCampaignPreview,
  GetManyCampaigns,
  GetOneCampaign,
  GetRunningCampaignStats,
  TestCampaign,
  UpdateCampaign,
  UpdateCampaignArchive,
  UpdateCampaignStatus,
} from "../services/campaignService";

const toNumberArray = (value: unknown): number[] | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const nums = value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
    return nums.length > 0 ? nums : undefined;
  }

  const num = Number(value);
  return Number.isFinite(num) ? [num] : undefined;
};

export const CampaignController = (app: AppInstance) => {
  app.group("/api/campaigns", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManyCampaigns(query);
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve all campaigns" },
          beforeHandle: AdminAuth,
          query: GetManyCampaignsDTO,
        },
      )
      .get(
        "/running/stats",
        async ({ query }) => {
          return await GetRunningCampaignStats(toNumberArray((query as any).campaign_id));
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve running campaign stats" },
          beforeHandle: AdminAuth,
          query: GetRunningCampaignStatsDTO,
        },
      )
      .get(
        "/analytics/:type",
        async ({ params, query }) => {
          return await GetCampaignAnalytics(params.type, {
            id: toNumberArray((query as any).id) || [],
            from: (query as any).from,
            to: (query as any).to,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve campaign analytics" },
          beforeHandle: AdminAuth,
          query: GetCampaignAnalyticsDTO,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetOneCampaign(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve a specific campaign" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id/preview",
        async ({ params }) => {
          return await GetCampaignPreview(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve preview of a campaign" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/:id/preview/archive",
        async ({ params }) => {
          return await GetCampaignPreview(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Retrieve archive preview of a campaign" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/:id/preview",
        async ({ params }) => {
          return await GetCampaignPreview(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Render campaign preview" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/:id/content",
        async ({ params, body }) => {
          return await ConvertCampaignContent({
            id: Number(params.id),
            from: body.from,
            to: body.to,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Convert campaign content" },
          beforeHandle: AdminAuth,
          body: CampaignContentDTO,
        },
      )
      .post(
        "/:id/text",
        async ({ params }) => {
          return await GetCampaignPreview(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Get campaign text preview" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/:id/test",
        async ({ params, body }) => {
          return await TestCampaign({
            campaignId: Number(params.id),
            subscriber_emails: body.subscribers || body.subscriber_emails || [],
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Test campaign with arbitrary subscribers" },
          beforeHandle: AdminAuth,
          body: TestCampaignDTO,
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateCampaign({
            ...body,
            list_ids: body.lists || body.list_ids,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Create a new campaign" },
          beforeHandle: AdminAuth,
          body: CreateCampaignDTO,
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await UpdateCampaign({
            ...body,
            id: Number(params.id),
            list_ids: body.lists || body.list_ids,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Update a campaign" },
          beforeHandle: AdminAuth,
          body: UpdateCampaignDTO,
        },
      )
      .put(
        "/:id",
        async ({ params, body }) => {
          return await UpdateCampaign({
            ...body,
            id: Number(params.id),
            list_ids: body.lists || body.list_ids,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Update a campaign" },
          beforeHandle: AdminAuth,
          body: UpdateCampaignDTO,
        },
      )
      .patch(
        "/:id/status",
        async ({ params, body }) => {
          return await UpdateCampaignStatus(Number(params.id), body.status);
        },
        {
          detail: { tags: ["Campaign"], description: "Change status of a campaign" },
          beforeHandle: AdminAuth,
          body: ChangeCampaignStatusDTO,
        },
      )
      .put(
        "/:id/status",
        async ({ params, body }) => {
          return await UpdateCampaignStatus(Number(params.id), body.status);
        },
        {
          detail: { tags: ["Campaign"], description: "Change status of a campaign" },
          beforeHandle: AdminAuth,
          body: ChangeCampaignStatusDTO,
        },
      )
      .patch(
        "/:id/archive",
        async ({ params, body }) => {
          return await UpdateCampaignArchive(Number(params.id), body);
        },
        {
          detail: { tags: ["Campaign"], description: "Publish campaign to public archive" },
          beforeHandle: AdminAuth,
          body: PublishCampaignDTO,
        },
      )
      .put(
        "/:id/archive",
        async ({ params, body }) => {
          return await UpdateCampaignArchive(Number(params.id), body);
        },
        {
          detail: { tags: ["Campaign"], description: "Publish campaign to public archive" },
          beforeHandle: AdminAuth,
          body: PublishCampaignDTO,
        },
      )
      .delete(
        "",
        async ({ query, body }) => {
          return await DeleteManyCampaigns({
            ids:
              toNumberArray((query as any).id) ||
              toNumberArray((body as any)?.id) ||
              toNumberArray((body as any)?.campaign_ids),
            query: (query as any)?.query || (body as any)?.query,
          });
        },
        {
          detail: { tags: ["Campaign"], description: "Delete multiple campaigns" },
          beforeHandle: AdminAuth,
          query: DeleteManyCampaignsDTO,
          body: t.Optional(DeleteManyCampaignsDTO),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteOneCampaign(Number(params.id));
        },
        {
          detail: { tags: ["Campaign"], description: "Delete a campaign" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
