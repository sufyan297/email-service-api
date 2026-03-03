import { t } from "elysia";
import type { AppInstance } from "../../index";
import { DeleteBounceRecordsDTO, GetBounceRecordsDTO } from "../dto/bounce";
import AdminAuth from "../middleware/admin_auth";
import {
  BlocklistBouncedSubscribers,
  DeleteManyBounceRecords,
  DeleteOneBounceRecord,
  GetBounceRecords,
  GetOneBounceRecord,
} from "../services/bounceService";

const toNumberArray = (value: unknown): number[] | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const nums = value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
    return nums.length > 0 ? nums : undefined;
  }

  const num = Number(value);
  return Number.isFinite(num) ? [num] : undefined;
};

export const BounceController = (app: AppInstance) => {
  app.group("/api/bounces", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetBounceRecords(query);
        },
        {
          detail: { tags: ["Bounce"], description: "Retrieve bounce records" },
          beforeHandle: AdminAuth,
          query: GetBounceRecordsDTO,
        },
      )
      .patch(
        "/blocklist",
        async () => {
          return await BlocklistBouncedSubscribers();
        },
        {
          detail: { tags: ["Bounce"], description: "Blocklist bounced subscribers" },
          beforeHandle: AdminAuth,
        },
      )
      .put(
        "/blocklist",
        async () => {
          return await BlocklistBouncedSubscribers();
        },
        {
          detail: { tags: ["Bounce"], description: "Blocklist bounced subscribers" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetOneBounceRecord(Number(params.id));
        },
        {
          detail: { tags: ["Bounce"], description: "Retrieve specific bounce record" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "",
        async ({ query, body }) => {
          const all = (query as any)?.all ?? (body as any)?.all ?? false;
          const ids =
            toNumberArray((query as any)?.id) ||
            toNumberArray((body as any)?.id) ||
            toNumberArray((body as any)?.ids);
          return await DeleteManyBounceRecords(Boolean(all), ids);
        },
        {
          detail: { tags: ["Bounce"], description: "Delete all/multiple bounce records" },
          beforeHandle: AdminAuth,
          query: DeleteBounceRecordsDTO,
          body: t.Optional(DeleteBounceRecordsDTO),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteOneBounceRecord(Number(params.id));
        },
        {
          detail: { tags: ["Bounce"], description: "Delete specific bounce record" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
