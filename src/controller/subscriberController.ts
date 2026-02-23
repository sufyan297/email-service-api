import type { AppInstance } from "../../index";
import {
  GetSubcribersDTO,
  GetSubscriberDTO,
  ExportSubscriberDTO,
  SubscriberBounceRecordsDTO,
  CreateSubscriberDTO,
  ModifySubscriberListMembershipDTO,
  UpdateSubscriberDTO,
  BlocklistSubscriberDTO,
  BlocklistMultipleSubscribersDTO,
  BlocklistByQueryDTO,
  DeleteSubscriberDTO,
  DeleteSubscriberBounceDTO,
  DeleteMultipleSubscribersDTO,
  DeleteSubscribersByQueryDTO,
} from "../dto/subcriber";
import AdminAuth from "../middleware/admin_auth";
import { CreateSubscriber } from "../services/subscriberService";

export const SubscriberController = (app: AppInstance) => {
  app.group("/subscribers", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Query and retrieve subscribers" },
        body: GetSubcribersDTO,
      })
      .get("/:subscriber_id", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Retrieve a specific subscriber" },
        body: GetSubscriberDTO,
      })
      .get("/:subscriber_id/export", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Export a specific subscriber" },
        body: ExportSubscriberDTO,
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
        body: GetSubscriberDTO,
      })
      .put("/lists", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Modify subscriber list memberships" },
        body: ModifySubscriberListMembershipDTO,
      })
      .put("/:subscriber_id", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Update a specific subscriber" },
        body: UpdateSubscriberDTO,
      })
      .put("/:subscriber_id/blocklist", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Blocklist a specific subscriber" },
        body: BlocklistSubscriberDTO,
      })
      .put("/blocklist", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Blocklist one or many subscribers" },
        body: BlocklistMultipleSubscribersDTO,
      })
      .put("/query/blocklist", async () => {}, {
        detail: {
          tags: ["Subscriber"],
          description: "Blocklist subscribers based on SQL expression",
        },
        body: BlocklistByQueryDTO,
      })
      .delete("/:subscriber_id", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Delete a specific subscriber" },
        body: DeleteSubscriberDTO,
      })
      .delete("/:subscriber_id/bounces", async () => {}, {
        detail: {
          tags: ["Subscriber"],
          description: "Delete a specific subscriber's bounce records",
        },
        body: DeleteSubscriberBounceDTO,
      })
      .delete("", async () => {}, {
        detail: { tags: ["Subscriber"], description: "Delete one or more subscribers" },
        body: DeleteMultipleSubscribersDTO,
      })
      .post("/query/delete", async () => {}, {
        detail: {
          tags: ["Subscriber"],
          description: "Delete subscribers based on SQL expression",
        },
        body: DeleteSubscribersByQueryDTO,
      }),
  );
};
