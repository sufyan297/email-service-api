import type { AppInstance } from "../../index";
import { GetManyListsDTO, CreateListDTO, UpdateListDTO, DeleteManyListsDTO } from "../dto/list";
import {
  CreateList,
  DeleteManyLists,
  DeleteOneList,
  GetManyLists,
  GetOneList,
  UpdateList,
} from "../services/listService";

export const ListController = (app: AppInstance) => {
  app.group("/lists", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManyLists(query);
        },
        {
          detail: { tags: ["List"], description: "Retrieve all lists" },
          query: GetManyListsDTO,
        },
      )
      .get(
        "/:list_id",
        async ({ params }) => {
          return await GetOneList(params.list_id);
        },
        {
          detail: { tags: ["List"], description: "Retrieve a specific list" },
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateList(body);
        },
        {
          detail: { tags: ["List"], description: "Create a new list" },
          body: CreateListDTO,
        },
      )
      .patch(
        "/:list_id",
        async ({ params, body }) => {
          return await UpdateList({ ...body, id: params.list_id });
        },
        {
          detail: { tags: ["List"], description: "Update a list" },
          body: UpdateListDTO,
        },
      )
      .delete(
        "/:list_id",
        async ({ params }) => {
          return await DeleteOneList(params.list_id);
        },
        {
          detail: { tags: ["List"], description: "Delete a list" },
        },
      )
      .delete(
        "",
        async ({ body }) => {
          return await DeleteManyLists(body.list_ids);
        },
        {
          detail: { tags: ["List"], description: "Delete multiple lists" },
          body: DeleteManyListsDTO,
        },
      ),
  );
};
