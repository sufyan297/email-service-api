import { t } from "elysia";

export const GetMediaDTO = t.Object({
  page: t.Integer({
    description: "Page number for paginated results",
    optional: true,
  }),
  per_page: t.Integer({
    description: "Results per page",
    optional: true,
  }),
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
