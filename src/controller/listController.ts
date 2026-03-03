import { t } from "elysia";
import type { AppInstance } from "../../index";
import {
  CreateListDTO,
  DeleteManyListsDTO,
  DeleteManyListsQueryDTO,
  GetManyListsDTO,
  UpdateListDTO,
} from "../dto/list";
import AdminAuth from "../middleware/admin_auth";
import {
  CreateList,
  DeleteManyLists,
  DeleteOneList,
  GetManyLists,
  GetOneList,
  UpdateList,
} from "../services/listService";

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

export const ListController = (app: AppInstance) => {
  app.group("/api/lists", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManyLists(query);
        },
        {
          detail: { tags: ["List"], description: "Retrieve all lists" },
          beforeHandle: AdminAuth,
          query: GetManyListsDTO,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetOneList(Number(params.id));
        },
        {
          detail: { tags: ["List"], description: "Retrieve a specific list" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateList(body);
        },
        {
          detail: { tags: ["List"], description: "Create a new list" },
          beforeHandle: AdminAuth,
          body: CreateListDTO,
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await UpdateList({ ...body, id: Number(params.id) });
        },
        {
          detail: { tags: ["List"], description: "Update a list" },
          beforeHandle: AdminAuth,
          body: UpdateListDTO,
        },
      )
      .put(
        "/:id",
        async ({ params, body }) => {
          return await UpdateList({ ...body, id: Number(params.id) });
        },
        {
          detail: { tags: ["List"], description: "Update a list" },
          beforeHandle: AdminAuth,
          body: UpdateListDTO,
        },
      )
      .delete(
        "",
        async ({ query, body }) => {
          const idsFromQuery = toNumberArray((query as any).id);
          const idsFromBody = toNumberArray((body as any)?.ids || (body as any)?.list_ids);
          return await DeleteManyLists({
            ids: idsFromQuery || idsFromBody,
            query: (query as any)?.query,
          });
        },
        {
          detail: { tags: ["List"], description: "Delete multiple lists" },
          beforeHandle: AdminAuth,
          query: DeleteManyListsQueryDTO,
          body: t.Optional(DeleteManyListsDTO),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteOneList(Number(params.id));
        },
        {
          detail: { tags: ["List"], description: "Delete a list" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
