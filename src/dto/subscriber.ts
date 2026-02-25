import { t } from "elysia";

export const GetManySubcribersDTO = t.Optional(
  t.Object({
    list_ids: t.Optional(
      t.Array(
        t.String({
          description: "ID of lists to filter by. Repeat in the query for multiple values",
          error: "Please Provide List Id",
        }),
      ),
    ),
    subscription_status: t.Optional(
      t.Boolean({
        description: "Subscription status to filter by if there are one or more list_ids",
        error: "Please Provide Subscription Status",
      }),
    ),
    order_by: t.Optional(
      t.Enum(
        {
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
        {
          description: "Result sorting field. Options: name, status, created_at, updated_at",
          error: "Please Provide Order By",
        },
      ),
    ),
    order: t.Optional(
      t.Enum(
        {
          ASC: "ASC",
          DESC: "DESC",
        },
        {
          description: "Sorting order: ASC for ascending, DESC for descending",
          error: "Please Provide Order",
        },
      ),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for paginated results",
        error: "Please Provide Page Number",
      }),
    ),
    per_page: t.Optional(
      t.Integer({
        description: "Results per page. Set as 'all' for all results",
        error: "Please Provide Per Page",
      }),
    ),
  }),
);

export const SubscriberBounceRecordsDTO = t.Object({
  subscriber_id: t.String({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const CreateSubscriberDTO = t.Object({
  name: t.String({
    description: "Subscriber's name",
    error: "Please Provide Name",
  }),
  email: t.String({
    description: "Subscriber's email address",
    error: "Please Provide Email",
  }),
  attributes: t.Optional(
    t.Any({
      description:
        'Optional JSON object attributes for the subscriber (e.g. {"location":"Somewhere"})',
    }),
  ),
  lists: t.Optional(
    t.Array(
      t.Integer({
        description: "List of list IDs to subscribe to",
        error: "Please Provide List IDs",
      }),
    ),
  ),
});

export const ModifySubscriberListDTO = t.Object({
  subscriber_ids: t.Array(
    t.String({
      description: "Array of user IDs to be modified",
      error: "Please Provide IDs",
    }),
  ),
  action: t.Enum(
    {
      add: "add",
      remove: "remove",
      unsubscribe: "unsubscribe",
    },
    {
      description: "Action to be applied: add, remove, or unsubscribe",
      error: "Please Provide Action",
    },
  ),
  target_list_ids: t.Array(
    t.String({
      description: "Array of list IDs to be modified",
      error: "Please Provide Target List IDs",
    }),
  ),
  subscription_status: t.Boolean({
    description: "Subscriber status for add: confirmed, unconfirmed, or unsubscribed",
  }),
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
    }),
  ),
  status: t.Optional(
    t.String({
      description: "Subscriber's status: enabled, blocklisted",
    }),
  ),
  list_ids: t.Optional(
    t.Array(
      t.String({
        description: "List of list IDs to subscribe to",
      }),
    ),
  ),
  attributes: t.Optional(
    t.Any({
      description: "Optional JSON object attributes for the subscriber",
    }),
  ),
  is_active: t.Optional(
    t.Boolean({
      description: "Subscriber's active status",
    }),
  ),
});

export const BlocklistManySubscribersDTO = t.Object({
  subscriber_ids: t.Array(
    t.String({
      description: "Array of subscriber IDs to blocklist",
      error: "Please Provide IDs",
    }),
  ),
});

export const DeleteManySubscribersDTO = t.Object({
  subscriber_ids: t.Array(
    t.String({
      description: "Array of subscriber IDs to delete",
      error: "Please Provide Subscriber IDs",
    }),
  ),
});
