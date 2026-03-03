import { t } from "elysia";

export const GetMediaDTO = t.Object({
  query: t.Optional(
    t.String({
      description: "Filter media by filename substring",
    }),
  ),
  page: t.Optional(
    t.Integer({
      description: "Page number for paginated results",
    }),
  ),
  per_page: t.Optional(
    t.Union([t.Integer({ minimum: 1 }), t.Literal("all")], {
      description: "Results per page",
    }),
  ),
});

export const GetSpecificMediaDTO = t.Object({
  media_id: t.Integer({
    description: "Media ID",
    error: "Please Provide Media ID",
  }),
});

export const UploadMediaDTO = t.Object({
  file: t.Any({
    description: "Media file to upload",
    error: "Please Provide File",
  }),
});

export const DeleteMediaDTO = t.Object({
  media_id: t.Integer({
    description: "ID of media file to delete",
    error: "Please Provide Media ID",
  }),
});
