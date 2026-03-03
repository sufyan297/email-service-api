import { createTransport } from "nodemailer";
import { AppError } from "../../libs/Errors";
import { getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Setting from "../models/Setting";
import SMTPConfig from "../models/SMTPConfig";

const maskSecret = (value: string | undefined) => {
  if (!value) {
    return value;
  }
  return "•".repeat(value.length);
};

const getSettingsMap = async () => {
  const settings = (await getMany("Setting", {
    where: {},
  })) as Setting[];

  const map: Record<string, any> = {};
  settings.forEach((setting) => {
    map[setting.key] = setting.value;
  });
  return map;
};

export const GetSettings = async (): Promise<APIResponse<Record<string, any>>> => {
  const map = await getSettingsMap();
  const smtp = (await getMany("SMTPConfig", {
    where: {},
    order: { created_at: "DESC" },
  })) as SMTPConfig[];

  map.smtp = smtp.map((item) => ({
    ...item,
    password: maskSecret(item.password),
  }));

  return {
    data: map,
    message: "Settings Retrieved Successfully",
    success: true,
  };
};

const upsertSetting = async (key: string, value: any) => {
  const existing = (await getOne("Setting", {
    where: { key },
  })) as Setting | null;

  if (existing) {
    await saveData("Setting", {
      id: existing.id,
      key,
      value,
    });
    return;
  }

  await saveData("Setting", { key, value });
};

export const UpdateSettings = async (
  body: Record<string, any>,
): Promise<APIResponse<{ needs_restart: boolean }>> => {
  if (Array.isArray(body.smtp)) {
    const existingSMTPConfigs = (await getMany("SMTPConfig", {})) as SMTPConfig[];
    let hasEnabledSMTP = false;

    await Promise.all(
      body.smtp.map(async (smtp: Partial<SMTPConfig>) => {
        if (smtp.enabled) {
          hasEnabledSMTP = true;
        }

        const existing = smtp.id
          ? existingSMTPConfigs.find((item) => item.id === smtp.id)
          : smtp.uuid
            ? existingSMTPConfigs.find((item) => item.uuid === smtp.uuid)
            : undefined;

        const payload = {
          ...smtp,
          host: smtp.host?.trim(),
          password: smtp.password || existing?.password || "",
        };

        await saveData("SMTPConfig", payload);
      }),
    );

    if (!hasEnabledSMTP) {
      throw new AppError("At least one enabled SMTP config is required", 400);
    }
  }

  await Promise.all(
    Object.entries(body)
      .filter(([key]) => key !== "smtp")
      .map(async ([key, value]) => {
        await upsertSetting(key, value);
      }),
  );

  return {
    data: { needs_restart: false },
    message: "Settings Updated Successfully",
    success: true,
  };
};

export const UpdateSettingsByKey = async (
  key: string,
  value: any,
): Promise<APIResponse<boolean>> => {
  await upsertSetting(key, value);
  return {
    data: true,
    message: "Setting Updated Successfully",
    success: true,
  };
};

const tlsTypeToOptions = (tlsType?: string) => {
  if (tlsType === "TLS") {
    return { secure: true, requireTLS: false, ignoreTLS: false };
  }
  if (tlsType === "STARTTLS") {
    return { secure: false, requireTLS: true, ignoreTLS: false };
  }
  return { secure: false, requireTLS: false, ignoreTLS: true };
};

export const TestSMTPSettings = async (body: {
  email: string;
  host: string;
  port: number;
  username: string;
  password: string;
  auth_protocol?: string;
  tls_type?: string;
  tls_skip_verify?: boolean;
  hello_hostname?: string;
}): Promise<APIResponse<boolean>> => {
  const tlsOptions = tlsTypeToOptions(body.tls_type);

  const transport = createTransport({
    host: body.host,
    port: body.port,
    auth: {
      user: body.username,
      pass: body.password,
    },
    name: body.hello_hostname,
    authMethod: body.auth_protocol?.toUpperCase(),
    secure: tlsOptions.secure,
    requireTLS: tlsOptions.requireTLS,
    ignoreTLS: tlsOptions.ignoreTLS,
    tls: {
      rejectUnauthorized: !body.tls_skip_verify,
    },
  });

  await transport.sendMail({
    from: body.username,
    to: body.email,
    subject: "SMTP test connection",
    html: "<p>SMTP test successful.</p>",
  });

  return {
    data: true,
    message: "SMTP Test Successful",
    success: true,
  };
};
