import { t } from "elysia";

export const GetBounceRecordsDTO = t.Object({
  campaign_id: t.Integer({
    description: "Bounce record retrieval for particular campaign id",
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
  source: t.String({
    description: "Source filter for bounce records",
    optional: true,
  }),
  order_by: t.String({
    description:
      "Fields by which bounce records are ordered. Options: email, campaign_name, source, created_at",
    optional: true,
  }),
  order: t.String({
    description: "Sorts the result. Allowed values: asc, desc",
    optional: true,
  }),
});

export const DeleteBouncesDTO = t.Object({
  all: t.Boolean({
    description: "Bool to confirm deleting all bounces",
    optional: true,
  }),
  id: t.Array(
    t.Integer({
      description: "IDs of bounce records to delete",
    }),
  ),
});

export const DeleteSpecificBounceDTO = t.Object({
  id: t.Integer({
    description: "ID of bounce record to delete",
    error: "Please Provide Bounce ID",
  }),
});
