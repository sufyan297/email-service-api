import { createTransport } from "nodemailer";
import { AppError } from "../../libs/Errors";
import { getMany, getOne } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import SMTPConfig from "../models/SMTPConfig";
import Subscriber from "../models/Subscriber";
import Template from "../models/Template";

const resolveSMTP = async () => {
  const defaultSMTP = (await getOne("SMTPConfig", {
    where: { enabled: true, is_default: true },
  })) as SMTPConfig | null;

  if (defaultSMTP) {
    return defaultSMTP;
  }

  const fallbackSMTP = (await getOne("SMTPConfig", {
    where: { enabled: true },
    order: { created_at: "DESC" },
  })) as SMTPConfig | null;

  if (!fallbackSMTP) {
    throw new AppError("No enabled SMTP config found", 400);
  }

  return fallbackSMTP;
};

const getFromEmail = async () => {
  const setting = (await getOne("Setting", {
    where: { key: "app.from_email" },
  })) as { value: string } | null;
  return (setting?.value as string) || "";
};

const mapTlsOptions = (type: string) => {
  if (type === "TLS") {
    return { secure: true, requireTLS: false, ignoreTLS: false };
  }
  if (type === "STARTTLS") {
    return { secure: false, requireTLS: true, ignoreTLS: false };
  }
  return { secure: false, requireTLS: false, ignoreTLS: true };
};

const renderBody = (
  source: string,
  subscriber: Subscriber,
  data: Record<string, unknown> = {},
): string => {
  let html = source;
  html = html.replaceAll("{{ .Subscriber.Name }}", subscriber.name || "");
  html = html.replaceAll("{{ .Subscriber.Email }}", subscriber.email || "");
  Object.entries(data).forEach(([key, value]) => {
    html = html.replaceAll(`{{ .Tx.Data.${key} }}`, String(value ?? ""));
  });
  return html;
};

export const SendTransactionalMessage = async (body: {
  subscriber_emails?: string[];
  subscriber_ids?: number[];
  subscriber_email?: string;
  subscriber_id?: number;
  template_id: number;
  from_email?: string;
  subject?: string;
  data?: Record<string, unknown>;
}): Promise<APIResponse<boolean>> => {
  const template = (await getOne("Template", {
    where: { id: body.template_id },
  })) as Template | null;

  if (!template) {
    throw new AppError("Template not found", 404);
  }

  const targetEmails = new Set<string>();
  if (body.subscriber_email) {
    targetEmails.add(body.subscriber_email.toLowerCase());
  }
  (body.subscriber_emails || []).forEach((email) => targetEmails.add(email.toLowerCase()));

  let subscribers: Subscriber[] = [];
  if ((body.subscriber_ids || []).length > 0 || body.subscriber_id) {
    const ids = [...new Set([...(body.subscriber_ids || []), ...(body.subscriber_id ? [body.subscriber_id] : [])])];
    subscribers = (await getMany("Subscriber", {
      where: { "id IN": ids },
    })) as Subscriber[];
    subscribers.forEach((subscriber) => targetEmails.add(subscriber.email.toLowerCase()));
  }

  if (targetEmails.size === 0) {
    throw new AppError("No subscribers to send", 400);
  }

  const smtp = await resolveSMTP();
  const tlsOptions = mapTlsOptions(smtp.tls_type);
  const fromEmail = body.from_email || (await getFromEmail()) || smtp.username;
  const subject = body.subject || template.subject || "Transactional message";

  const transport = createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: { user: smtp.username, pass: smtp.password },
    authMethod: smtp.auth_protocol.toUpperCase(),
    secure: tlsOptions.secure,
    requireTLS: tlsOptions.requireTLS,
    ignoreTLS: tlsOptions.ignoreTLS,
    tls: {
      rejectUnauthorized: !smtp.tls_skip_verify,
    },
    name: smtp.hello_hostname,
  });

  const knownByEmail = new Map(subscribers.map((subscriber) => [subscriber.email.toLowerCase(), subscriber]));
  await Promise.all(
    [...targetEmails].map(async (email) => {
      const subscriber = knownByEmail.get(email) || ({ email, name: email.split("@")[0] } as Subscriber);
      const html = renderBody(template.body, subscriber, body.data || {});

      await transport.sendMail({
        from: fromEmail,
        to: email,
        subject,
        html,
      });
    }),
  );

  return {
    data: true,
    message: "Transactional Message Sent Successfully",
    success: true,
  };
};
