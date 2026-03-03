import { t } from "elysia";
import { Order } from "../types/constants";

export const GetBounceRecordsDTO = t.Object({
  campaign_id: t.Optional(
    t.Integer({
      description: "Bounce record retrieval for particular campaign id",
    }),
  ),
  page: t.Optional(
    t.Integer({
      description: "Page number for pagination",
    }),
  ),
  per_page: t.Optional(
    t.Union([t.Integer({ minimum: 1 }), t.Literal("all")], {
      description: "Results per page. Set to 'all' to return all results",
    }),
  ),
  source: t.Optional(
    t.String({
      description: "Source filter for bounce records",
    }),
  ),
  order_by: t.Optional(
    t.Enum(
      {
        email: "email",
        campaign_name: "campaign_name",
        source: "source",
        created_at: "created_at",
      },
      {
        description:
          "Fields by which bounce records are ordered. Options: email, campaign_name, source, created_at",
      },
    ),
  ),
  order: t.Optional(
    t.Union([
      t.Enum(Order, {
        description: "Sorts the result. Allowed values: ASC, DESC",
      }),
      t.Enum({
        asc: "asc",
        desc: "desc",
      }),
    ]),
  ),
});

export const DeleteBounceRecordsDTO = t.Object({
  all: t.Optional(
    t.Boolean({
      description: "Bool to confirm deleting all bounces",
    }),
  ),
  id: t.Optional(
    t.Union([
      t.Integer({
        description: "ID of bounce record to delete",
      }),
      t.Array(
        t.Integer({
          description: "IDs of bounce records to delete",
        }),
      ),
    ]),
  ),
  ids: t.Optional(
    t.Array(
      t.Integer({
        description: "IDs of bounce records to delete",
      }),
    ),
  ),
});
