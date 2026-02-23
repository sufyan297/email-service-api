import { t } from "elysia";

export const GetListsDTO = t.Object({
  query: t.String({
    description: "String for list name search",
    optional: true,
  }),
  status: t.String({
    description: "Status to filter lists. Options: active, archived",
    optional: true,
  }),
  minimal: t.Boolean({
    description: "If true, returns lists without subscriber counts (faster)",
    optional: true,
  }),
  tag: t.Array(
    t.String({
      description: "Tags to filter lists. Repeat for multiple values",
    }),
  ),
  order_by: t.String({
    description: "Sort field. Options: name, status, created_at, updated_at",
    optional: true,
  }),
  order: t.String({
    description: "Sorting order. Options: ASC, DESC",
    optional: true,
  }),
  page: t.Integer({
    description: "Page number for pagination",
    optional: true,
  }),
  per_page: t.String({
    description: "Results per page. Set to 'all' to return all results",
    optional: true,
  }),
});

export const GetListDTO = t.Object({
  id: t.Integer({
    description: "List ID",
    error: "Please Provide List ID",
  }),
});

export const CreateListDTO = t.Object({
  name: t.String({
    description: "Name of the new list",
    error: "Please Provide List Name",
  }),
  type: t.String({
    description: "Type of list. Options: private, public",
    error: "Please Provide List Type",
  }),
  optin: t.String({
    description: "Opt-in type. Options: single, double",
    error: "Please Provide Opt-in Type",
  }),
  status: t.String({
    description: "Status of the list. Options: active, archived",
    optional: true,
  }),
  tags: t.Array(
    t.String({
      description: "Associated tags for a list",
    }),
  ),
  description: t.String({
    description: "Description of the new list",
    optional: true,
  }),
});

export const UpdateListDTO = t.Object({
  list_id: t.Integer({
    description: "ID of the list to update",
    error: "Please Provide List ID",
  }),
  name: t.String({
    description: "New name for the list",
    optional: true,
  }),
  type: t.String({
    description: "Type of list. Options: private, public",
    optional: true,
  }),
  optin: t.String({
    description: "Opt-in type. Options: single, double",
    optional: true,
  }),
  status: t.String({
    description: "Status of the list. Options: active, archived",
    optional: true,
  }),
  tags: t.Array(
    t.String({
      description: "Associated tags for the list",
    }),
  ),
  description: t.String({
    description: "Description of the list",
    optional: true,
  }),
});

export const DeleteListDTO = t.Object({
  id: t.Integer({
    description: "List ID",
    error: "Please Provide List ID",
  }),
});

export const DeleteMultipleListsDTO = t.Object({
  id: t.Array(
    t.Integer({
      description: "One or more list IDs to delete",
      error: "Please Provide List IDs",
    }),
  ),
  query: t.String({
    description: "Search query to filter lists for deletion",
    optional: true,
  }),
});
