import { t } from "elysia";
import { ListOptin, ListStatus, ListType, Order } from "../types/constants";

const PerPageDTO = t.Union([t.Integer({ minimum: 1 }), t.Literal("all")]);

export const GetManyListsDTO = t.Optional(
  t.Object({
    query: t.Optional(
      t.String({
        description: "String for list name search",
      }),
    ),
    type: t.Optional(t.Enum(ListType)),
    optin: t.Optional(t.Enum(ListOptin)),
    status: t.Optional(
      t.Enum(ListStatus, {
        description: "Status to filter lists.",
      }),
    ),
    minimal: t.Optional(
      t.Boolean({
        description: "If true, returns lists without subscriber counts",
      }),
    ),
    tag: t.Optional(
      t.Union([
        t.String({
          description: "Tag to filter lists by",
        }),
        t.Array(
          t.String({
            description: "Tags to filter lists by",
          }),
        ),
      ]),
    ),
    tags: t.Optional(t.Array(t.String())),
    order_by: t.Optional(
      t.Enum(
        { name: "name", status: "status", created_at: "created_at", updated_at: "updated_at" },
        {
          description: "Sort field. Options: name, status, created_at, updated_at",
        },
      ),
    ),
    order: t.Optional(
      t.Enum(Order, {
        description: "Sorting order. Options: ASC, DESC",
      }),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for pagination",
      }),
    ),
    per_page: t.Optional(
      PerPageDTO,
    ),
  }),
);

export const CreateListDTO = t.Object({
  name: t.String({
    description: "Name of the new list",
    error: "Please Provide List Name",
    minLength: 1,
    maxLength: 255,
  }),
  type: t.Enum(ListType, {
    description: "Type of list. Options: private, public",
    error: "Please Provide List Type",
  }),
  optin: t.Enum(ListOptin, {
    description: "Opt-in mode. Options: single, double",
    error: "Please Provide Opt-in Type",
  }),
  status: t.Optional(t.Enum(ListStatus, { description: "Active or Archive" })),
  tags: t.Optional(t.Array(t.String())),
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
      minLength: 1,
      maxLength: 255,
    }),
  ),
  type: t.Optional(
    t.Enum(ListType, {
      description: "Type of list. Options: private, public",
    }),
  ),
  optin: t.Optional(
    t.Enum(ListOptin, {
      description: "Opt-in type. Options: single, double",
    }),
  ),
  status: t.Optional(t.Enum(ListStatus, { description: "Active or Archive" })),
  description: t.Optional(
    t.String({
      description: "Description of the list",
    }),
  ),
});

export const DeleteManyListsDTO = t.Object({
  ids: t.Array(
    t.Number({
      description: "One or more list IDs to delete",
      error: "Please Provide List IDs",
    }),
  ),
  list_ids: t.Optional(
    t.Array(
      t.Number({
        description: "One or more list IDs to delete",
      }),
    ),
  ),
});

export const DeleteManyListsQueryDTO = t.Object({
  id: t.Optional(
    t.Union([
      t.Integer({
        description: "One or more list IDs to delete",
      }),
      t.Array(
        t.Integer({
          description: "One or more list IDs to delete",
        }),
      ),
    ]),
  ),
  query: t.Optional(
    t.String({
      description: "Search query to filter lists for deletion",
    }),
  ),
});
