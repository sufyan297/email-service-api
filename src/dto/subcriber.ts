import { t } from "elysia";

export const GetSubcribersDTO = t.Object({
  query: t.String({
    description: "Subscriber search by SQL expression",
    error: "Please Provide Query",
  }),
  list_id: t.Array(
    t.Integer({
      description: "ID of lists to filter by. Repeat in the query for multiple values",
      error: "Please Provide List Id",
    }),
  ),
  subscription_status: t.String({
    description: "Subscription status to filter by if there are one or more list_ids",
    error: "Please Provide Subscription Status",
  }),
  order_by: t.String({
    description: "Result sorting field. Options: name, status, created_at, updated_at",
    error: "Please Provide Order By",
  }),
  order: t.String({
    description: "Sorting order: ASC for ascending, DESC for descending",
    error: "Please Provide Order",
  }),
  page: t.Integer({
    description: "Page number for paginated results",
    error: "Please Provide Page Number",
  }),
  per_page: t.Integer({
    description: "Results per page. Set as 'all' for all results",
    error: "Please Provide Per Page",
  }),
});

export const GetSubscriberDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const ExportSubscriberDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const SubscriberBounceRecordsDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const CreateSubscriberDTO = t.Object({
  email: t.String({
    description: "Subscriber's email address",
    error: "Please Provide Email",
  }),
  name: t.String({
    description: "Subscriber's name",
    error: "Please Provide Name",
  }),
  status: t.String({
    description: "Subscriber's status: enabled, blocklisted",
    error: "Please Provide Status",
  }),
  lists: t.Array(
    t.Integer({
      description: "List of list IDs to subscribe to",
      error: "Please Provide List IDs",
    }),
  ),
  attribs: t.Any({
    description:
      'Optional JSON object attributes for the subscriber (e.g. {"location":"Somewhere"})',
  }),
  preconfirm_subscriptions: t.Boolean({
    description:
      "If true, subscriptions are marked as confirmed and no-optin emails are sent for double opt-in lists",
  }),
});

export const ModifySubscriberListMembershipDTO = t.Object({
  ids: t.Array(
    t.Integer({
      description: "Array of user IDs to be modified",
      error: "Please Provide IDs",
    }),
  ),
  action: t.String({
    description: "Action to be applied: add, remove, or unsubscribe",
    error: "Please Provide Action",
  }),
  target_list_ids: t.Array(
    t.Integer({
      description: "Array of list IDs to be modified",
      error: "Please Provide Target List IDs",
    }),
  ),
  status: t.String({
    description: "Subscriber status for add: confirmed, unconfirmed, or unsubscribed",
  }),
});

export const UpdateSubscriberDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
  email: t.String({
    description: "Subscriber's email address",
  }),
  name: t.String({
    description: "Subscriber's name",
  }),
  status: t.String({
    description: "Subscriber's status: enabled, blocklisted",
  }),
  lists: t.Array(
    t.Integer({
      description: "List of list IDs to subscribe to",
    }),
  ),
  attribs: t.Any({
    description: "Optional JSON object attributes for the subscriber",
  }),
  preconfirm_subscriptions: t.Boolean({
    description:
      "If true, subscriptions are marked as confirmed and no-optin emails are sent for double opt-in lists",
  }),
});

export const BlocklistSubscriberDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const BlocklistMultipleSubscribersDTO = t.Object({
  ids: t.Array(
    t.Integer({
      description: "Array of subscriber IDs to blocklist",
      error: "Please Provide IDs",
    }),
  ),
});

export const BlocklistByQueryDTO = t.Object({
  query: t.String({
    description: "SQL expression to filter subscribers",
    error: "Please Provide Query",
  }),
  list_ids: t.Array(
    t.Integer({
      description:
        "Optional list IDs to limit the filtering to (provide to further restrict the query)",
    }),
  ),
});

export const DeleteSubscriberDTO = t.Object({
  subscriber_id: t.Integer({
    description: "Subscriber's ID",
    error: "Please Provide Subscriber ID",
  }),
});

export const DeleteSubscriberBounceDTO = t.Object({
  id: t.Integer({
    description: "Subscriber's ID for deleting bounce records",
    error: "Please Provide Subscriber ID",
  }),
});

export const DeleteMultipleSubscribersDTO = t.Object({
  id: t.Array(
    t.Integer({
      description: "Array of subscriber IDs to delete",
      error: "Please Provide Subscriber IDs",
    }),
  ),
});

export const DeleteSubscribersByQueryDTO = t.Object({
  query: t.String({
    description: "SQL expression to filter subscribers to delete",
  }),
  list_ids: t.Array(
    t.Integer({
      description: "Optional list IDs to limit the filtering to",
    }),
  ),
  all: t.Boolean({
    description: "When true, ignores any query and deletes all subscribers",
  }),
});
