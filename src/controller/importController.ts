import type { AppInstance } from "../../index";
import { AdminLoginDTO, ChangePasswordDTO } from "../dto/admin";
import { ImportSubscribersDTO } from "../dto/import";

export const ImportController = (app: AppInstance) => {
  app.group("/import", (app) =>
    app.group("/subscribers", (app) =>
      app
        .get("", async () => {}, {
          detail: { tags: ["Import"], description: "Retrieve import statistics" },
        })
        .get("/logs", async () => {}, {
          detail: { tags: ["Import"], description: "Retrieve import logs" },
        })
        .post("", async () => {}, {
          detail: { tags: ["Import"], description: "Upload a file for bulk subscriber import" },
          body: ImportSubscribersDTO,
        })
        .delete("", async () => {}, {
          detail: { tags: ["Import"], description: "Stop and remove an import" },
          body: ChangePasswordDTO,
        }),
    ),
  );
};
