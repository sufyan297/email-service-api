import type { AppInstance } from "../../index";
import { GetMediaDTO, GetSpecificMediaDTO, UploadMediaDTO, DeleteMediaDTO } from "../dto/media";

export const MediaController = (app: AppInstance) => {
  app.group("/media", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["Media"], description: "Get uploaded media file" },
        body: GetMediaDTO,
      })
      .get("/:media_id", async () => {}, {
        detail: { tags: ["Media"], description: "Get specific uploaded media file" },
        body: GetSpecificMediaDTO,
      })
      .post("", async () => {}, {
        detail: { tags: ["Media"], description: "Upload media file" },
        body: UploadMediaDTO,
      })
      .delete("/:media_id", async () => {}, {
        detail: { tags: ["Media"], description: "Delete uploaded media file" },
        body: DeleteMediaDTO,
      }),
  );
};
