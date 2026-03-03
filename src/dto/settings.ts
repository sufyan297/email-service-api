import { t } from "elysia";

export const UpdateSettingsDTO = t.Record(t.String(), t.Any());

export const UpdateSettingByKeyDTO = t.Object({
  value: t.Any(),
});

export const TestSMTPSettingsDTO = t.Object({
  email: t.String({
    description: "Recipient email for SMTP test",
  }),
  host: t.String(),
  port: t.Integer(),
  username: t.String(),
  password: t.String(),
  auth_protocol: t.Optional(t.String()),
  tls_type: t.Optional(t.String()),
  tls_skip_verify: t.Optional(t.Boolean()),
  hello_hostname: t.Optional(t.String()),
});
