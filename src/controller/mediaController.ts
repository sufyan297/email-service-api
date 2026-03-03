import type { AppInstance } from "../../index";
import { GetMediaDTO, UploadMediaDTO } from "../dto/media";
import AdminAuth from "../middleware/admin_auth";
import { DeleteMedia, GetMedia, GetOneMedia, UploadMedia } from "../services/mediaService";

export const MediaController = (app: AppInstance) => {
  app.group("/api/media", (app) =>
    app
      .get(
        "",
        async ({ query, request }) => {
          return await GetMedia(query, request.url);
        },
        {
          detail: { tags: ["Media"], description: "Get uploaded media files" },
          beforeHandle: AdminAuth,
          query: GetMediaDTO,
        },
      )
      .get(
        "/:id",
        async ({ params, request }) => {
          return await GetOneMedia(Number(params.id), request.url);
        },
        {
          detail: { tags: ["Media"], description: "Get specific uploaded media file" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body, request }) => {
          return await UploadMedia(body, request.url);
        },
        {
          detail: { tags: ["Media"], description: "Upload media file" },
          beforeHandle: AdminAuth,
          body: UploadMediaDTO,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteMedia(Number(params.id));
        },
        {
          detail: { tags: ["Media"], description: "Delete uploaded media file" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
