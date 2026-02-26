import { t } from "elysia";

export const GetManyListsDTO = t.Optional(
  t.Object({
    query: t.Optional(
      t.String({
        description: "String for list name search",
      }),
    ),
    is_active: t.Optional(
      t.Boolean({
        description: "Status to filter lists.",
      }),
    ),
    order_by: t.Optional(
      t.Enum(
        {
          createdAt: "createdAt",
          updatedAt: "updatedAt",
          name: "name",
          status: "status",
        },
        {
          description: "Sort field. Options: name, status, created_at, updated_at",
        },
      ),
    ),
    order: t.Optional(
      t.Enum(
        {
          asc: "ASC",
          desc: "DESC",
        },
        {
          description: "Sorting order. Options: ASC, DESC",
        },
      ),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for pagination",
      }),
    ),
    per_page: t.Optional(
      t.Integer({
        description: "Results per page. Set to 'all' to return all results",
      }),
    ),
  }),
);

export const CreateListDTO = t.Object({
  name: t.String({
    description: "Name of the new list",
    error: "Please Provide List Name",
  }),
  is_private: t.Boolean({
    description: "Type of list. Options: private, public",
    error: "Please Provide List Type",
  }),
  optin_mode: t.Enum(
    {
      single: "single",
      double: "double",
    },
    {
      description: "Opt-in type. Options: single, double",
      error: "Please Provide Opt-in Type",
    },
  ),
  is_active: t.Optional(t.Boolean({ description: "Active or Archive" })),
  description: t.Optional(
    t.String({
      description: "Description of the new list",
    }),
  ),
});

export const UpdateListDTO = t.Object({
  name: t.Optional(
    t.String({
      description: "New name for the list",
    }),
  ),
  type: t.Optional(
    t.Boolean({
      description: "Type of list. Options: private, public",
    }),
  ),
  optin_mode: t.Optional(
    t.Enum(
      {
        single: "single",
        double: "double",
      },
      {
        description: "Opt-in type. Options: single, double",
      },
    ),
  ),
  is_active: t.Optional(t.Boolean({ description: "Active or Archive" })),
  description: t.Optional(
    t.String({
      description: "Description of the list",
    }),
  ),
});

export const DeleteManyListsDTO = t.Object({
  list_ids: t.Array(
    t.String({
      description: "One or more list IDs to delete",
      error: "Please Provide List IDs",
    }),
  ),
});
