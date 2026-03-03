import { t } from "elysia";
import { CampaignContentType, CampaignStatus, CampaignType, Order } from "../types/constants";

const PerPageDTO = t.Union([t.Integer({ minimum: 1 }), t.Literal("all")]);

export const GetManyCampaignsDTO = t.Optional(
  t.Object({
    tags: t.Optional(t.Array(t.String())),
    no_body: t.Optional(t.Boolean()),
    order: t.Optional(
      t.Enum(Order, {
        description: "Sorting order: ASC for ascending, DESC for descending",
      }),
    ),
    order_by: t.Optional(
      t.Enum(
        { name: "name", status: "status", created_at: "created_at", updated_at: "updated_at" },
        {
          description: "Result sorting field. Options: name, status, created_at, updated_at",
        },
      ),
    ),
    query: t.Optional(
      t.String({
        description: "String to filter by campaign name and subject (fulltext and substring)",
      }),
    ),
    status: t.Optional(
      t.Union([
        t.Enum(CampaignStatus, {
          description: "Status to filter campaigns",
        }),
        t.Array(
          t.Enum(CampaignStatus, {
            description: "Status to filter campaigns. Repeat in query for multiple values",
          }),
        ),
      ]),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for paginated results",
      }),
    ),
    per_page: t.Optional(
      PerPageDTO,
    ),
  }),
);

export const CreateCampaignDTO = t.Object({
  name: t.String({
    description: "Campaign name",
    error: "Please Provide Name",
    minLength: 1,
    maxLength: 255,
  }),
  subject: t.String({
    description: "Campaign email subject",
    error: "Please Provide Subject",
    minLength: 1,
    maxLength: 255,
  }),
  body: t.String({
    description: "Content body of campaign",
    error: "Please Provide Body",
    minLength: 1,
  }),
  content_type: t.Enum(CampaignContentType),
  lists: t.Array(
    t.Integer({
      description: "List IDs to send campaign to",
      error: "Please Provide List IDs",
    }),
    { minItems: 1 },
  ),
  list_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "List IDs to send campaign to",
      }),
      { minItems: 1 },
    ),
  ),
  from_email: t.Optional(
    t.String({
      description: "'From' email in campaign emails",
    }),
  ),
  type: t.Enum(CampaignType, {
    description: "Campaign type: 'regular' or 'optin'",
  }),
  altbody: t.Optional(t.String()),
  body_source: t.Optional(
    t.String({
      description: "If content_type is visual, the JSON block source of the body",
    }),
  ),
  send_at: t.Optional(
    t.Date({
      description: "Timestamp to schedule campaign (YYYY-MM-DDTHH:MM:SSZ)",
    }),
  ),
  tags: t.Optional(t.Array(t.String())),
  template_id: t.Optional(
    t.Integer({
      description: "Template ID to use",
    }),
  ),
  smtp_config_id: t.Optional(
    t.Integer({
      description: "SMTP configuration ID to use for this campaign",
    }),
  ),
  headers: t.Optional(
    t.Array(
      t.Record(t.String({ minLength: 1 }), t.String(), {
        description: "Key-value pairs to send as SMTP headers",
      }),
    ),
  ),
  attribs: t.Optional(
    t.Record(t.String(), t.Unknown(), {
      description: "Optional campaign attributes",
    }),
  ),
});

export const TestCampaignDTO = t.Object({
  subscribers: t.Array(
    t.String({
      description: "List of subscriber e-mails to send the message to",
      error: "Please Provide Subscribers",
    }),
  ),
  subscriber_emails: t.Optional(
    t.Array(
      t.String({
        description: "List of subscriber e-mails to send the message to",
      }),
    ),
  ),
});

export const UpdateCampaignDTO = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  subject: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  lists: t.Optional(t.Array(t.Integer(), { minItems: 1 })),
  list_ids: t.Optional(t.Array(t.Integer(), { minItems: 1 })),
  from_email: t.Optional(t.String()),
  content_type: t.Optional(t.Enum(CampaignContentType)),
  body: t.Optional(t.String()),
  body_source: t.Optional(t.String()),
  altbody: t.Optional(t.String()),
  send_at: t.Optional(t.Date()),
  template_id: t.Optional(t.Integer()),
  smtp_config_id: t.Optional(t.Integer()),
  tags: t.Optional(t.Array(t.String())),
  headers: t.Optional(
    t.Array(
      t.Record(t.String({ minLength: 1 }), t.String(), {
        description: "Key-value pairs to send as SMTP headers",
      }),
    ),
  ),
  attribs: t.Optional(t.Record(t.String(), t.Unknown())),
});

export const ChangeCampaignStatusDTO = t.Object({
  status: t.Enum(CampaignStatus, {
    description: "New status for campaign: 'scheduled','running','paused','cancelled'",
    error: "Please Provide Status",
  }),
  send_at: t.Optional(t.Date()),
});

export const PublishCampaignDTO = t.Object({
  archive: t.Boolean({
    description: "State of the public archive",
    error: "Please Provide Archive State",
  }),
  archive_template_id: t.Optional(t.Integer()),
  archive_meta: t.Optional(t.Record(t.String(), t.Unknown())),
  archive_slug: t.Optional(t.String()),
});

export const DeleteManyCampaignsDTO = t.Object({
  id: t.Optional(
    t.Union([
      t.Integer({
        description: "One or more campaign IDs to delete",
      }),
      t.Array(
        t.Integer({
          description: "One or more campaign IDs to delete",
        }),
      ),
    ]),
  ),
  campaign_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "One or more campaign IDs to delete",
      }),
    ),
  ),
  query: t.Optional(
    t.String({
      description: "Search query to filter campaigns for deletion",
    }),
  ),
});

export const CampaignContentDTO = t.Object({
  from: t.String({
    description: "Source content type",
  }),
  to: t.String({
    description: "Target content type",
  }),
});

export const GetRunningCampaignStatsDTO = t.Object({
  campaign_id: t.Optional(
    t.Union([
      t.Integer({
        description: "Campaign IDs to get stats for",
      }),
      t.Array(
        t.Integer({
          description: "Campaign IDs to get stats for",
        }),
      ),
    ]),
  ),
});

export const GetCampaignAnalyticsDTO = t.Object({
  id: t.Union([
    t.Integer({
      description: "Campaign IDs to get analytics for",
    }),
    t.Array(
      t.Integer({
        description: "Campaign IDs to get analytics for",
      }),
    ),
  ]),
  from: t.String({
    description: "Start date/time of the range",
  }),
  to: t.String({
    description: "End date/time of the range",
  }),
});
