import { t } from "elysia";

export const SendTransactionalDTO = t.Object({
  subscriber_email: t.String({
    description: "Email of the subscriber. Can substitute with subscriber_id",
    optional: true,
  }),
  subscriber_id: t.Integer({
    description: "Subscriber's ID. Can substitute with subscriber_email",
    optional: true,
  }),
  subscriber_emails: t.Array(
    t.String({
      description: "Multiple subscriber emails as alternative to subscriber_email",
    }),
  ),
  subscriber_ids: t.Array(
    t.Integer({
      description: "Multiple subscriber IDs as alternative to subscriber_id",
    }),
  ),
  subscriber_mode: t.String({
    description: "Subscriber lookup mode: default, fallback, or external",
    optional: true,
  }),
  template_id: t.Integer({
    description: "ID of the transactional template to be used for the message",
    error: "Please Provide Template ID",
  }),
  from_email: t.String({
    description: "Optional sender email",
    optional: true,
  }),
  subject: t.String({
    description: "Optional subject. If empty, the subject defined on the template is used",
    optional: true,
  }),
  data: t.Any({
    description: "Optional nested JSON map. Available in the template as {{ .Tx.Data.* }}",
    optional: true,
  }),
  headers: t.Array(
    t.Any({
      description: "Optional array of email headers",
    }),
  ),
  messenger: t.String({
    description: "Messenger to send the message. Default is email",
    optional: true,
  }),
  content_type: t.String({
    description: "Email format options: html, markdown, and plain",
    optional: true,
  }),
});
