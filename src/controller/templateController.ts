import type { AppInstance } from "../../index";
import {
  GetTemplatesDTO,
  GetSpecificTemplateDTO,
  TemplatePreviewDTO,
  CreateTemplateDTO,
  PreviewTemplateDTO,
  UpdateTemplateDTO,
  SetDefaultTemplateDTO,
  DeleteTemplateDTO,
} from "../dto/template";

export const TemplateController = (app: AppInstance) => {
  app.group("/templates", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["Template"], description: "Retrieve all templates" },
        body: GetTemplatesDTO,
      })
      .get("/:template_id", async () => {}, {
        detail: { tags: ["Template"], description: "Retrieve a template" },
        body: GetSpecificTemplateDTO,
      })
      .get("/:template_id/preview", async () => {}, {
        detail: { tags: ["Template"], description: "Retrieve template HTML preview" },
        body: TemplatePreviewDTO,
      })
      .post("", async () => {}, {
        detail: { tags: ["Template"], description: "Create a template" },
        body: CreateTemplateDTO,
      })
      .post("/preview", async () => {}, {
        detail: { tags: ["Template"], description: "Render and preview a template" },
        body: PreviewTemplateDTO,
      })
      .put("/:template_id", async () => {}, {
        detail: { tags: ["Template"], description: "Update a template" },
        body: UpdateTemplateDTO,
      })
      .put("/:template_id/default", async () => {}, {
        detail: { tags: ["Template"], description: "Set default template" },
        body: SetDefaultTemplateDTO,
      })
      .delete("/:template_id", async () => {}, {
        detail: { tags: ["Template"], description: "Delete a template" },
        body: DeleteTemplateDTO,
      }),
  );
};
