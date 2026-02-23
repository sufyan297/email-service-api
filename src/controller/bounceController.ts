import type { AppInstance } from "../../index";
import { GetBounceRecordsDTO, DeleteBouncesDTO, DeleteSpecificBounceDTO } from "../dto/bounce";

export const BounceController = (app: AppInstance) => {
  app.group("/bounces", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["Bounce"], description: "Retrieve bounce records" },
        body: GetBounceRecordsDTO,
      })
      .delete("", async () => {}, {
        detail: { tags: ["Bounce"], description: "Delete all/multiple bounce records" },
        body: DeleteBouncesDTO,
      })
      .delete("/:bounce_id", async () => {}, {
        detail: { tags: ["Bounce"], description: "Delete specific bounce record" },
        body: DeleteSpecificBounceDTO,
      }),
  );
};
