import { t } from "elysia";
import { SMTPConfigAuthProtocol, SMTPConfigTlsType, Order } from "../types/constants";

export const GetManySMTPConfigsDTO = t.Optional(
  t.Object({
    query: t.Optional(
      t.String({
        description: "String for SMTP host search",
      }),
    ),
    enabled: t.Optional(
      t.Boolean({
        description: "Filter by enabled SMTP configs",
      }),
    ),
    is_default: t.Optional(
      t.Boolean({
        description: "Filter by default SMTP config",
      }),
    ),
    order_by: t.Optional(
      t.Enum(
        {
          host: "host",
          port: "port",
          username: "username",
          created_at: "created_at",
          updated_at: "updated_at",
        },
        {
          description: "Sort field. Options: host, port, username, created_at, updated_at",
        },
      ),
    ),
    order: t.Optional(
      t.Enum(Order, {
        description: "Sorting order. Options: ASC, DESC",
      }),
    ),
    page: t.Optional(
      t.Integer({
        description: "Page number for pagination",
      }),
    ),
    per_page: t.Optional(
      t.Integer({
        description: "Results per page",
        minimum: 1,
        maximum: 1000,
      }),
    ),
  }),
);

const SMTPConfigBodyFields = {
  enabled: t.Optional(
    t.Boolean({
      description: "Enable or disable this SMTP config",
    }),
  ),
  name: t.Optional(
    t.String({
      description: "SMTP profile name",
    }),
  ),
  host: t.String({
    description: "SMTP host",
    error: "Please Provide SMTP Host",
    minLength: 1,
  }),
  port: t.Integer({
    description: "SMTP port",
    error: "Please Provide SMTP Port",
    minimum: 1,
    maximum: 65535,
  }),
  hello_hostname: t.Optional(
    t.String({
      description: "Optional EHLO/HELO hostname",
    }),
  ),
  auth_protocol: t.Enum(SMTPConfigAuthProtocol, {
    description: "SMTP auth protocol. Options: plain, login, cram, none",
    error: "Please Provide Auth Protocol",
  }),
  username: t.String({
    description: "SMTP username",
    error: "Please Provide SMTP Username",
    minLength: 1,
  }),
  password: t.String({
    description: "SMTP password",
    error: "Please Provide SMTP Password",
    minLength: 1,
  }),
  email_headers: t.Optional(
    t.Array(
      t.Record(t.String({ minLength: 1 }), t.String(), {
        description: "Key-value pairs to include as SMTP headers",
      }),
    ),
  ),
  max_conns: t.Integer({
    description: "Maximum SMTP connections",
    error: "Please Provide Max Connections",
    minimum: 1,
  }),
  max_msg_retries: t.Integer({
    description: "Maximum message retry attempts",
    error: "Please Provide Max Message Retries",
    minimum: 0,
  }),
  idle_timeout: t.String({
    description: "SMTP idle timeout",
    error: "Please Provide Idle Timeout",
    minLength: 1,
  }),
  wait_timeout: t.String({
    description: "SMTP wait timeout",
    error: "Please Provide Wait Timeout",
    minLength: 1,
  }),
  tls_type: t.Enum(SMTPConfigTlsType, {
    description: "TLS type. Options: none, STARTTLS, TLS",
    error: "Please Provide TLS Type",
  }),
  tls_skip_verify: t.Optional(
    t.Boolean({
      description: "Skip TLS certificate verification",
    }),
  ),
  is_default: t.Optional(
    t.Boolean({
      description: "Set as default SMTP config",
    }),
  ),
};

export const CreateSMTPConfigDTO = t.Object(SMTPConfigBodyFields);

export const UpdateSMTPConfigDTO = t.Object({
  enabled: t.Optional(t.Boolean()),
  host: t.Optional(t.String({ minLength: 1 })),
  port: t.Optional(t.Integer({ minimum: 1, maximum: 65535 })),
  hello_hostname: t.Optional(t.String()),
  auth_protocol: t.Optional(t.Enum(SMTPConfigAuthProtocol)),
  username: t.Optional(t.String({ minLength: 1 })),
  password: t.Optional(t.String({ minLength: 1 })),
  email_headers: t.Optional(t.Array(t.Record(t.String({ minLength: 1 }), t.String()))),
  max_conns: t.Optional(t.Integer({ minimum: 1 })),
  max_msg_retries: t.Optional(t.Integer({ minimum: 0 })),
  idle_timeout: t.Optional(t.String({ minLength: 1 })),
  wait_timeout: t.Optional(t.String({ minLength: 1 })),
  tls_type: t.Optional(t.Enum(SMTPConfigTlsType)),
  tls_skip_verify: t.Optional(t.Boolean()),
  is_default: t.Optional(t.Boolean()),
});

export const DeleteManySMTPConfigsDTO = t.Object({
  smtp_config_ids: t.Array(
    t.Integer({
      description: "One or more SMTP config IDs to delete",
      error: "Please Provide SMTP Config IDs",
    }),
  ),
});
