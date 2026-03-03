import { t } from "elysia";
import { ListAction, Order, SubscriberStatus, SubscriptionStatus } from "../types/constants";

const PerPageDTO = t.Union([t.Integer({ minimum: 1 }), t.Literal("all")]);

export const GetManySubcribersDTO = t.Optional(
  t.Object({
    query: t.Optional(
      t.String({
        description: "Subscriber search by SQL expression",
      }),
    ),
    list_id: t.Optional(
      t.Union([
        t.Integer({
          description: "ID of a list to filter by",
        }),
        t.Array(
          t.Integer({
            description: "ID of lists to filter by. Repeat in the query for multiple values",
          }),
        ),
      ]),
    ),
    list_ids: t.Optional(
      t.Array(
        t.Integer({
          description: "ID of lists to filter by. Repeat in the query for multiple values",
        }),
      ),
    ),
    subscription_status: t.Optional(
      t.Enum(SubscriptionStatus, {
        description: "Subscription status to filter by if there are one or more list_ids",
      }),
    ),
    order_by: t.Optional(
      t.Enum(
        { name: "name", status: "status", created_at: "created_at", updated_at: "updated_at" },
        {
          description: "Result sorting field. Options: name, status, created_at, updated_at",
        },
      ),
    ),
    order: t.Optional(
      t.Enum(Order, {
        description: "Sorting order: ASC for ascending, DESC for descending",
      }),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for paginated results",
      }),
    ),
    per_page: t.Optional(
      PerPageDTO,
    ),
  }),
);

export const CreateSubscriberDTO = t.Object({
  name: t.String({
    description: "Subscriber's name",
    error: "Please Provide Name",
    minLength: 1,
    maxLength: 255,
  }),
  email: t.String({
    description: "Subscriber's email address",
    error: "Please Provide Email",
  }),
  status: t.Enum(
    {
      enabled: "enabled",
      blocklisted: "blocklisted",
    },
    { description: "Subscriber status", error: "Please Provide Subscriber Status" },
  ),
  attribs: t.Optional(
    t.Record(t.String(), t.Unknown(), {
      description:
        'Optional JSON object attributes for the subscriber (e.g. {"location":"Somewhere"})',
    }),
  ),
  lists: t.Optional(
    t.Array(
      t.Integer({
        description: "List of list IDs to subscribe to",
      }),
    ),
  ),
  list_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "List of list IDs to subscribe to",
      }),
    ),
  ),
  preconfirm_subscriptions: t.Optional(
    t.Boolean({ description: "Preconfirmation of subscriptions" }),
  ),
});

export const ModifySubscriberListDTO = t.Object({
  ids: t.Array(
    t.Integer({
      description: "Array of user IDs to be modified",
      error: "Please Provide IDs",
    }),
  ),
  subscriber_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "Array of user IDs to be modified",
      }),
    ),
  ),
  action: t.Enum(ListAction, {
    description: "Action to be applied: add, remove, or unsubscribe",
    error: "Please Provide Action",
  }),
  target_list_ids: t.Array(
    t.Integer({
      description: "Array of list IDs to be modified",
      error: "Please Provide Target List IDs",
    }),
  ),
  status: t.Optional(
    t.Enum(SubscriptionStatus, {
      description: "Subscriber status for add: confirmed, unconfirmed, or unsubscribed",
    }),
  ),
});

export const UpdateSubscriberDTO = t.Object({
  email: t.Optional(
    t.String({
      description: "Subscriber's email address",
    }),
  ),
  name: t.Optional(
    t.String({
      description: "Subscriber's name",
      minLength: 1,
      maxLength: 255,
    }),
  ),
  status: t.Optional(
    t.Enum(SubscriberStatus, {
      description: "Subscriber's status",
    }),
  ),
  lists: t.Optional(
    t.Array(
      t.Integer({
        description: "List of list IDs to subscribe to",
      }),
    ),
  ),
  list_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "List of list IDs to subscribe to",
      }),
    ),
  ),
  attribs: t.Optional(
    t.Record(t.String(), t.Unknown(), {
      description:
        'Optional JSON object attributes for the subscriber (e.g. {"location":"Somewhere"})',
    }),
  ),
  preconfirm_subscriptions: t.Optional(
    t.Boolean({ description: "Preconfirmation of subscriptions" }),
  ),
});

export const BlocklistManySubscribersDTO = t.Object({
  ids: t.Array(
    t.Number({
      description: "Array of subscriber IDs to blocklist",
      error: "Please Provide IDs",
    }),
    { minItems: 1 },
  ),
  subscriber_ids: t.Optional(
    t.Array(
      t.Number({
        description: "Array of subscriber IDs to blocklist",
      }),
      { minItems: 1 },
    ),
  ),
});

export const DeleteManySubscribersDTO = t.Object({
  ids: t.Array(
    t.Integer({
      description: "Array of subscriber IDs to delete",
      error: "Please Provide Subscriber IDs",
    }),
    { minItems: 1 },
  ),
  subscriber_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "Array of subscriber IDs to delete",
      }),
      { minItems: 1 },
    ),
  ),
});

export const SubscriberQueryActionDTO = t.Object({
  query: t.Optional(
    t.String({
      description: "SQL expression to filter subscribers with",
    }),
  ),
  list_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "Optional list IDs to limit filtering",
      }),
    ),
  ),
  all: t.Optional(
    t.Boolean({
      description: "If true, ignores query and applies operation to all subscribers",
    }),
  ),
});
