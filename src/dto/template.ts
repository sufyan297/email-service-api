import { t } from "elysia";
import { TemplateType } from "../types/constants";

export const GetTemplatesDTO = t.Object({
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

export const GetSpecificTemplateDTO = t.Object({
  template_id: t.Integer({
    description: "ID of the template to retrieve",
    error: "Please Provide Template ID",
  }),
});

export const TemplatePreviewDTO = t.Object({
  template_id: t.Integer({
    description: "ID of the template to preview",
    error: "Please Provide Template ID",
  }),
});

export const CreateTemplateDTO = t.Object({
  name: t.String({
    description: "Name of the template",
    error: "Please Provide Name",
  }),
  type: t.Enum(TemplateType, {
    description: "Type of the template (campaign, campaign_visual, or tx)",
    error: "Please Provide Type",
  }),
  subject: t.Optional(
    t.String({
      description: "Subject line for the template (only for tx)",
    }),
  ),
  body_source: t.Optional(
    t.String({
      description: "If type is campaign_visual, the JSON source for the email-builder template",
    }),
  ),
  body: t.String({
    description: "HTML body of the template",
    error: "Please Provide Body",
  }),
});

export const PreviewTemplateDTO = t.Object({
  name: t.String({
    description: "Name of the template",
    error: "Please Provide Name",
  }),
  type: t.Enum(TemplateType, {
    description: "Type of the template (campaign, campaign_visual, or tx)",
    error: "Please Provide Type",
  }),
  subject: t.Optional(
    t.String({
      description: "Subject line for the template (only for tx)",
    }),
  ),
  body_source: t.Optional(
    t.String({
      description: "If type is campaign_visual, the JSON source for the email-builder template",
    }),
  ),
  body: t.String({
    description: "HTML body of the template",
    error: "Please Provide Body",
  }),
});

export const UpdateTemplateDTO = t.Object({
  name: t.Optional(
    t.String({
      description: "Name of the template",
    }),
  ),
  type: t.Optional(
    t.Enum(TemplateType, {
      description: "Type of the template (campaign, campaign_visual, or tx)",
    }),
  ),
  subject: t.Optional(
    t.String({
      description: "Subject line for the template (only for tx)",
    }),
  ),
  body_source: t.Optional(
    t.String({
      description: "If type is campaign_visual, the JSON source for the email-builder template",
    }),
  ),
  body: t.Optional(
    t.String({
      description: "HTML body of the template",
    }),
  ),
});
