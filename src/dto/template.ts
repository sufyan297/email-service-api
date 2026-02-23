import { t } from "elysia";

export const GetTemplatesDTO = t.Object({
  page: t.Integer({
    description: "Page number for paginated results",
    optional: true,
  }),
  per_page: t.Integer({
    description: "Results per page",
    optional: true,
  }),
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
  type: t.String({
    description: "Type of the template (campaign, campaign_visual, or tx)",
    error: "Please Provide Type",
  }),
  subject: t.String({
    description: "Subject line for the template (only for tx)",
    optional: true,
  }),
  body_source: t.String({
    description: "If type is campaign_visual, the JSON source for the email-builder template",
    optional: true,
  }),
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
  type: t.String({
    description: "Type of the template (campaign, campaign_visual, or tx)",
    error: "Please Provide Type",
  }),
  subject: t.String({
    description: "Subject line for the template (only for tx)",
    optional: true,
  }),
  body_source: t.String({
    description: "If type is campaign_visual, the JSON source for the email-builder template",
    optional: true,
  }),
  body: t.String({
    description: "HTML body of the template",
    error: "Please Provide Body",
  }),
});

export const UpdateTemplateDTO = t.Object({
  template_id: t.Integer({
    description: "ID of the template to update",
    error: "Please Provide Template ID",
  }),
  name: t.String({
    description: "Name of the template",
    optional: true,
  }),
  type: t.String({
    description: "Type of the template (campaign, campaign_visual, or tx)",
    optional: true,
  }),
  subject: t.String({
    description: "Subject line for the template (only for tx)",
    optional: true,
  }),
  body_source: t.String({
    description: "If type is campaign_visual, the JSON source for the email-builder template",
    optional: true,
  }),
  body: t.String({
    description: "HTML body of the template",
    optional: true,
  }),
});

export const SetDefaultTemplateDTO = t.Object({
  template_id: t.Integer({
    description: "ID of the template to set as default",
    error: "Please Provide Template ID",
  }),
});

export const DeleteTemplateDTO = t.Object({
  template_id: t.Integer({
    description: "ID of the template to delete",
    error: "Please Provide Template ID",
  }),
});
