import { t } from "elysia";

export const SendTransactionalDTO = t.Object({
  subscriber_email: t.Optional(
    t.String({
      description: "Email of the subscriber. Can substitute with subscriber_id",
    }),
  ),
  subscriber_id: t.Optional(
    t.Integer({
      description: "Subscriber's ID. Can substitute with subscriber_email",
    }),
  ),
  subscriber_emails: t.Optional(
    t.Array(
      t.String({
        description: "Multiple subscriber emails as alternative to subscriber_email",
      }),
    ),
  ),
  subscriber_ids: t.Optional(
    t.Array(
      t.Integer({
        description: "Multiple subscriber IDs as alternative to subscriber_id",
      }),
    ),
  ),
  subscriber_mode: t.Optional(
    t.Enum(
      {
        default: "default",
        fallback: "fallback",
        external: "external",
      },
      {
        description: "Subscriber lookup mode: default, fallback, or external",
      },
    ),
  ),
  template_id: t.Integer({
    description: "ID of the transactional template to be used for the message",
    error: "Please Provide Template ID",
  }),
  from_email: t.Optional(
    t.String({
      description: "Optional sender email",
    }),
  ),
  subject: t.Optional(
    t.String({
      description: "Optional subject. If empty, the subject defined on the template is used",
    }),
  ),
  data: t.Optional(
    t.Any({
      description: "Optional nested JSON map. Available in the template as {{ .Tx.Data.* }}",
    }),
  ),
  headers: t.Optional(
    t.Array(
      t.Any({
        description: "Optional array of email headers",
      }),
    ),
  ),
  messenger: t.Optional(
    t.String({
      description: "Messenger to use. Email-only mode supports 'email'",
    }),
  ),
  content_type: t.Optional(
    t.Enum(
      {
        html: "html",
        markdown: "markdown",
        plain: "plain",
      },
      {
        description: "Email format options: html, markdown, and plain",
      },
    ),
  ),
});
