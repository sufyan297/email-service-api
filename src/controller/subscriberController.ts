import { t } from "elysia";
import type { AppInstance } from "../../index";
import {
  BlocklistManySubscribersDTO,
  CreateSubscriberDTO,
  DeleteManySubscribersDTO,
  GetManySubcribersDTO,
  ModifySubscriberListDTO,
  SubscriberQueryActionDTO,
  UpdateSubscriberDTO,
} from "../dto/subscriber";
import AdminAuth from "../middleware/admin_auth";
import {
  BlockListManySubscribers,
  BlocklistOneSubscriber,
  BlocklistSubscribersByQuery,
  CreateSubscriber,
  DeleteManySubscriber,
  DeleteOneSubscriber,
  DeleteSubscriberBounceRecords,
  DeleteSubscribersByQuery,
  ExportSubscriberData,
  ExportSubscribers,
  GetManySubscribers,
  GetOneSubscriber,
  GetSubscriberActivity,
  GetSubscriberBounceRecords,
  ManageSubscriberListsByQuery,
  ModifySubscriberList,
  SendSubscriberOptin,
  UpdateSubscriber,
} from "../services/subscriberService";

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

export const SubscriberController = (app: AppInstance) => {
  app.group("/api/subscribers", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManySubscribers({
            ...query,
            list_id: toNumberArray((query as any).list_id),
            list_ids: toNumberArray((query as any).list_ids),
          } as any);
        },
        {
          detail: { tags: ["Subscriber"], description: "Query and retrieve subscribers" },
          beforeHandle: AdminAuth,
          query: GetManySubcribersDTO,
        },
      )
      .get(
        "/export",
        async () => {
          return await ExportSubscribers();
        },
        {
          detail: { tags: ["Subscriber"], description: "Export subscribers" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetOneSubscriber(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Retrieve a specific subscriber" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id/activity",
        async ({ params }) => {
          return await GetSubscriberActivity(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Retrieve subscriber activity" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id/export",
        async ({ params }) => {
          return await ExportSubscriberData(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Export specific subscriber" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id/bounces",
        async ({ params }) => {
          return await GetSubscriberBounceRecords(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Retrieve subscriber bounce records" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateSubscriber(
            { ...body, status: body.status as any },
            body.lists || body.list_ids,
            body.preconfirm_subscriptions,
          );
        },
        {
          detail: { tags: ["Subscriber"], description: "Create a new subscriber" },
          beforeHandle: AdminAuth,
          body: CreateSubscriberDTO,
        },
      )
      .post(
        "/:id/optin",
        async ({ params }) => {
          return await SendSubscriberOptin(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Send opt-in confirmation email" },
          beforeHandle: AdminAuth,
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await UpdateSubscriber(
            { ...body, id: Number(params.id) },
            body.lists || body.list_ids,
            body.preconfirm_subscriptions,
          );
        },
        {
          detail: { tags: ["Subscriber"], description: "Update subscriber" },
          beforeHandle: AdminAuth,
          body: UpdateSubscriberDTO,
        },
      )
      .put(
        "/:id",
        async ({ params, body }) => {
          return await UpdateSubscriber(
            { ...body, id: Number(params.id) },
            body.lists || body.list_ids,
            body.preconfirm_subscriptions,
          );
        },
        {
          detail: { tags: ["Subscriber"], description: "Update subscriber" },
          beforeHandle: AdminAuth,
          body: UpdateSubscriberDTO,
        },
      )
      .patch(
        "/:id/blocklist",
        async ({ params }) => {
          return await BlocklistOneSubscriber(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist one subscriber" },
          beforeHandle: AdminAuth,
        },
      )
      .put(
        "/:id/blocklist",
        async ({ params }) => {
          return await BlocklistOneSubscriber(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist one subscriber" },
          beforeHandle: AdminAuth,
        },
      )
      .patch(
        "/blocklist",
        async ({ body }) => {
          return await BlockListManySubscribers({
            ids: body.ids || body.subscriber_ids,
          });
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist many subscribers" },
          beforeHandle: AdminAuth,
          body: BlocklistManySubscribersDTO,
        },
      )
      .put(
        "/blocklist",
        async ({ body }) => {
          return await BlockListManySubscribers({
            ids: body.ids || body.subscriber_ids,
          });
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist many subscribers" },
          beforeHandle: AdminAuth,
          body: BlocklistManySubscribersDTO,
        },
      )
      .patch(
        "/lists/:id",
        async ({ params, body }) => {
          return await ModifySubscriberList({
            ...body,
            ids: body.ids || body.subscriber_ids || [Number(params.id)],
          });
        },
        {
          detail: { tags: ["Subscriber"], description: "Modify subscriber list memberships" },
          beforeHandle: AdminAuth,
          body: ModifySubscriberListDTO,
        },
      )
      .patch(
        "/lists",
        async ({ body }) => {
          return await ModifySubscriberList(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Modify subscriber list memberships" },
          beforeHandle: AdminAuth,
          body: ModifySubscriberListDTO,
        },
      )
      .put(
        "/lists",
        async ({ body }) => {
          return await ModifySubscriberList(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Modify subscriber list memberships" },
          beforeHandle: AdminAuth,
          body: ModifySubscriberListDTO,
        },
      )
      .post(
        "/query/delete",
        async ({ body }) => {
          return await DeleteSubscribersByQuery(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete subscribers by query" },
          beforeHandle: AdminAuth,
          body: SubscriberQueryActionDTO,
        },
      )
      .put(
        "/query/blocklist",
        async ({ body }) => {
          return await BlocklistSubscribersByQuery(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist subscribers by query" },
          beforeHandle: AdminAuth,
          body: SubscriberQueryActionDTO,
        },
      )
      .post(
        "/query/blocklist",
        async ({ body }) => {
          return await BlocklistSubscribersByQuery(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist subscribers by query" },
          beforeHandle: AdminAuth,
          body: SubscriberQueryActionDTO,
        },
      )
      .patch(
        "/query/lists",
        async ({ body }) => {
          return await ManageSubscriberListsByQuery(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Modify subscribers lists by query" },
          beforeHandle: AdminAuth,
          body: ModifySubscriberListDTO,
        },
      )
      .delete(
        "",
        async ({ query, body }) => {
          const idsFromQuery = toNumberArray((query as any).id);
          const idsFromBody = toNumberArray((body as any)?.ids || (body as any)?.subscriber_ids);
          return await DeleteManySubscriber(idsFromQuery || idsFromBody || []);
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete subscribers" },
          beforeHandle: AdminAuth,
          query: t.Object({
            id: t.Optional(t.Union([t.Integer(), t.Array(t.Integer())])),
          }),
          body: t.Optional(DeleteManySubscribersDTO),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteOneSubscriber(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete specific subscriber" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/:id/bounces",
        async ({ params }) => {
          return await DeleteSubscriberBounceRecords(Number(params.id));
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete subscriber bounce records" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
