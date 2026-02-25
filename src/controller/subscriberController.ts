import type { AppInstance } from "../../index";
import {
  GetManySubcribersDTO,
  SubscriberBounceRecordsDTO,
  CreateSubscriberDTO,
  ModifySubscriberListDTO,
  UpdateSubscriberDTO,
  BlocklistManySubscribersDTO,
  DeleteManySubscribersDTO,
} from "../dto/subscriber";
import AdminAuth from "../middleware/admin_auth";
import {
  BlockListManySubscribers,
  BlocklistOneSubscriber,
  CreateSubscriber,
  DeleteManySubscriber,
  DeleteOneSubscriber,
  DeleteSubscriberBounceRecords,
  GetManySubscribers,
  GetOneSubscriber,
  ModifySubscriberList,
  UpdateSubscriber,
} from "../services/subscriberService";

export const SubscriberController = (app: AppInstance) => {
  app.group("/subscribers", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManySubscribers(query);
        },
        {
          detail: { tags: ["Subscriber"], description: "Query and retrieve subscribers" },
          query: GetManySubcribersDTO,
        },
      )
      .get(
        "/:subscriber_id",
        async ({ params }) => {
          return await GetOneSubscriber(params.subscriber_id);
        },
        {
          detail: { tags: ["Subscriber"], description: "Retrieve a specific subscriber" },
        },
      )
      .get("/:subscriber_id/export", async ({ params }) => {}, {
        detail: { tags: ["Subscriber"], description: "Export a specific subscriber" },
      })
      .get("/:subscriber_id/bounces", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Retrieve a subscriber bounce records" },
        body: SubscriberBounceRecordsDTO,
      })
      .post(
        "",
        async ({ body }) => {
          return await CreateSubscriber(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Create a new subscriber" },
          beforeHandle: AdminAuth,
          body: CreateSubscriberDTO,
        },
      )
      .post("/:subscriber_id/optin", async () => {}, {
        detail: {
          tags: ["Subscriber"],
          description: "Sends optin confirmation email to subscribers",
        },
      })
      .patch(
        "/:subscriber_id",
        async ({ params, body }) => {
          return await UpdateSubscriber({ ...body, id: params.subscriber_id }, body.list_ids);
        },
        {
          detail: { tags: ["Subscriber"], description: "Update a specific subscriber" },
          beforeHandle: AdminAuth,
          body: UpdateSubscriberDTO,
        },
      )
      .patch(
        "/:subscriber_id/blocklist",
        async ({ params }) => {
          return await BlocklistOneSubscriber(params.subscriber_id);
        },
        {
          detail: { tags: ["Subscriber"], description: "Update a specific subscriber" },
        },
      )
      .put(
        "/lists",
        async ({ body }) => {
          return await ModifySubscriberList(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Modify subscriber list memberships" },
          body: ModifySubscriberListDTO,
        },
      )
      .patch(
        "/blocklist",
        async ({ body }) => {
          return await BlockListManySubscribers(body);
        },
        {
          detail: { tags: ["Subscriber"], description: "Blocklist one or many subscribers" },
          body: BlocklistManySubscribersDTO,
        },
      )
      .delete(
        "/:subscriber_id",
        async ({ params }) => {
          return await DeleteOneSubscriber(params.subscriber_id);
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete a specific subscriber" },
        },
      )
      .delete(
        "/:subscriber_id/bounces",
        async ({ params }) => {
          return await DeleteSubscriberBounceRecords(params.subscriber_id);
        },
        {
          detail: {
            tags: ["Subscriber"],
            description: "Delete a specific subscriber's bounce records",
          },
        },
      )
      .delete(
        "",
        async ({ body }) => {
          return await DeleteManySubscriber(body.subscriber_ids);
        },
        {
          detail: { tags: ["Subscriber"], description: "Delete one or more subscribers" },
          body: DeleteManySubscribersDTO,
        },
      ),
  );
};
