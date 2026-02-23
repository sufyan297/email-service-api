import type { AppInstance } from "../../index";
import {
  GetListsDTO,
  GetListDTO,
  CreateListDTO,
  UpdateListDTO,
  DeleteListDTO,
  DeleteMultipleListsDTO,
} from "../dto/list";

export const ListController = (app: AppInstance) => {
  app.group("/lists", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["List"], description: "Retrieve all lists" },
        body: GetListsDTO,
      })
      .get("/:list_id", async () => {}, {
        detail: { tags: ["List"], description: "Retrieve a specific list" },
        body: GetListDTO,
      })
      .post("", async () => {}, {
        detail: { tags: ["List"], description: "Create a new list" },
        body: CreateListDTO,
      })
      .put("/:list_id", async () => {}, {
        detail: { tags: ["List"], description: "Update a list" },
        body: UpdateListDTO,
      })
      .delete("/:list_id", async () => {}, {
        detail: { tags: ["List"], description: "Delete a list" },
        body: DeleteListDTO,
      })
      .delete("", async () => {}, {
        detail: { tags: ["List"], description: "Delete multiple lists" },
        body: DeleteMultipleListsDTO,
      }),
  );
};
