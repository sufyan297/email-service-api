import { t } from "elysia";

export const GetCampaignsDTO = t.Object({
  order: t.String({
    description: "Sorting order: ASC for ascending, DESC for descending",
    optional: true,
  }),
  order_by: t.String({
    description: "Result sorting field. Options: name, status, created_at, updated_at",
    optional: true,
  }),
  query: t.String({
    description: "String to filter by campaign name and subject (fulltext and substring)",
    optional: true,
  }),
  status: t.Array(
    t.String({
      description: "Status to filter campaigns. Repeat for multiple values",
    }),
  ),
  tags: t.Array(
    t.String({
      description: "Tags to filter campaigns. Repeat for multiple values",
    }),
  ),
  page: t.Integer({
    description: "Page number for paginated results",
    optional: true,
  }),
  per_page: t.String({
    description: "Results per page. Set as 'all' for all results",
    optional: true,
  }),
  no_body: t.Boolean({
    description: "When true, returns response without body content",
    optional: true,
  }),
});

export const GetCampaignDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID",
    error: "Please Provide Campaign ID",
  }),
  no_body: t.Boolean({
    description: "When true, returns response without body content",
    optional: true,
  }),
});

export const CampaignPreviewDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID to preview",
    error: "Please Provide Campaign ID",
  }),
});

export const CampaignStatsDTO = t.Object({
  campaign_id: t.Array(
    t.Integer({
      description: "Campaign IDs to get stats for",
    }),
  ),
});

export const CampaignAnalyticsDTO = t.Object({
  id: t.Array(
    t.Integer({
      description: "Campaign IDs to get analytics for",
      error: "Please Provide Campaign IDs",
    }),
  ),
  type: t.String({
    description: "Analytics type: views, links, clicks, bounces",
    error: "Please Provide Analytics Type",
  }),
  from: t.String({
    description: "Start value of date range",
    error: "Please Provide From Date",
  }),
  to: t.String({
    description: "End value of date range",
    error: "Please Provide To Date",
  }),
});

export const CreateCampaignDTO = t.Object({
  name: t.String({
    description: "Campaign name",
    error: "Please Provide Name",
  }),
  subject: t.String({
    description: "Campaign email subject",
    error: "Please Provide Subject",
  }),
  lists: t.Array(
    t.Integer({
      description: "List IDs to send campaign to",
      error: "Please Provide List IDs",
    }),
  ),
  from_email: t.String({
    description: "'From' email in campaign emails",
    optional: true,
  }),
  type: t.String({
    description: "Campaign type: 'regular' or 'optin'",
    error: "Please Provide Type",
  }),
  content_type: t.String({
    description: "Content type: 'richtext','html','markdown','plain','visual'",
    error: "Please Provide Content Type",
  }),
  body: t.String({
    description: "Content body of campaign",
    error: "Please Provide Body",
  }),
  body_source: t.String({
    description: "If content_type is visual, the JSON block source of the body",
    optional: true,
  }),
  altbody: t.String({
    description: "Alternate plain text body for HTML (and richtext) emails",
    optional: true,
  }),
  send_at: t.String({
    description: "Timestamp to schedule campaign (YYYY-MM-DDTHH:MM:SSZ)",
    optional: true,
  }),
  messenger: t.String({
    description: "'email' or a custom messenger defined in settings",
    optional: true,
  }),
  template_id: t.Integer({
    description: "Template ID to use",
    optional: true,
  }),
  tags: t.Array(
    t.String({
      description: "Tags to mark campaign",
    }),
  ),
  headers: t.Any({
    description: "Key-value pairs to send as SMTP headers",
    optional: true,
  }),
  attribs: t.Any({
    description: "Optional JSON object attributes for campaign templates",
    optional: true,
  }),
});

export const TestCampaignDTO = t.Object({
  subscribers: t.Array(
    t.String({
      description: "List of subscriber e-mails to send the message to",
      error: "Please Provide Subscribers",
    }),
  ),
});

export const UpdateCampaignDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID",
    error: "Please Provide Campaign ID",
  }),
  name: t.String({ optional: true }),
  subject: t.String({ optional: true }),
  lists: t.Array(t.Integer({ optional: true })),
  from_email: t.String({ optional: true }),
  type: t.String({ optional: true }),
  content_type: t.String({ optional: true }),
  body: t.String({ optional: true }),
  body_source: t.String({ optional: true }),
  altbody: t.String({ optional: true }),
  send_at: t.String({ optional: true }),
  messenger: t.String({ optional: true }),
  template_id: t.Integer({ optional: true }),
  tags: t.Array(t.String({ optional: true })),
  headers: t.Any({ optional: true }),
  attribs: t.Any({ optional: true }),
});

export const ChangeCampaignStatusDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID to change status",
    error: "Please Provide Campaign ID",
  }),
  status: t.String({
    description: "New status for campaign: 'scheduled','running','paused','cancelled'",
    error: "Please Provide Status",
  }),
});

export const PublishCampaignDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID to publish",
    error: "Please Provide Campaign ID",
  }),
  archive: t.Boolean({
    description: "State of the public archive",
    error: "Please Provide Archive State",
  }),
  archive_template_id: t.Integer({ optional: true }),
  archive_meta: t.String({ optional: true }),
  archive_slug: t.String({ optional: true }),
});

export const DeleteCampaignDTO = t.Object({
  campaign_id: t.Integer({
    description: "Campaign ID to delete",
    error: "Please Provide Campaign ID",
  }),
});

export const DeleteMultipleCampaignsDTO = t.Object({
  id: t.Array(
    t.Integer({
      description: "One or more campaign IDs to delete",
    }),
  ),
  query: t.String({
    description: "Fulltext search query to filter campaigns for deletion",
    optional: true,
  }),
});
