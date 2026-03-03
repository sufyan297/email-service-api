import { AppError } from "../../libs/Errors";
import { getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import ImportJob from "../models/ImportJob";
import ImportLog from "../models/ImportLog";
import Subscriber from "../models/Subscriber";
import { SubscriberStatus, SubscriptionStatus } from "../types/constants";

type ImportParams = {
  mode?: "subscribe" | "blocklist";
  subscription_status?: SubscriptionStatus;
  delim?: string;
  lists?: number[];
  overwrite?: boolean;
};

const DEFAULT_STATUS = {
  name: "",
  total: 0,
  imported: 0,
  status: "none",
};

const parseCSV = (content: string, delim: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === delim) {
      row.push(field);
      field = "";
      continue;
    }

    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") {
        i++;
      }
      row.push(field);
      field = "";
      if (row.some((v) => v.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += ch;
  }

  row.push(field);
  if (row.some((v) => v.length > 0)) {
    rows.push(row);
  }

  return rows;
};

const cleanHeader = (value: string) => value.replace(/^[\uFEFF\u200B]+/, "").trim().toLowerCase();

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const normalizeName = (email: string, name?: string) => {
  const trimmed = (name || "").trim();
  if (trimmed) {
    return trimmed;
  }
  const prefix = email.split("@")[0] || "subscriber";
  return prefix;
};

const parseAttributes = (value?: string): Record<string, unknown> => {
  if (!value || value.trim() === "") {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const isValidEmail = (email: string) =>
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(email);

const addImportLog = async (jobId: number, message: string) => {
  await saveData("ImportLog", {
    import_job_id: jobId,
    message,
  });
};

export const GetImportSubscribers = async (): Promise<APIResponse<ImportJob | null>> => {
  const latest = (await getOne("ImportJob", {
    where: {},
    order: { created_at: "DESC" },
  })) as ImportJob | null;

  return {
    data: latest || (DEFAULT_STATUS as any),
    message: "Import Stats Retrieved Successfully",
    success: true,
  };
};

export const GetImportSubscriberLogs = async (): Promise<APIResponse<string>> => {
  const latest = (await getOne("ImportJob", {
    where: {},
    order: { created_at: "DESC" },
  })) as ImportJob | null;

  if (!latest) {
    return {
      data: "",
      message: "Import Logs Retrieved Successfully",
      success: true,
    };
  }

  const logs = (await getMany("ImportLog", {
    where: { import_job_id: latest.id },
    order: { created_at: "DESC" },
    limit: 200,
  })) as ImportLog[];

  return {
    data: logs
      .slice()
      .reverse()
      .map((log) => log.message)
      .join("\n"),
    message: "Import Logs Retrieved Successfully",
    success: true,
  };
};

export const ImportSubscribers = async ({
  params,
  file,
}: {
  params: unknown;
  file?: File | Blob | { name?: string; type?: string; arrayBuffer?: () => Promise<ArrayBuffer> };
}): Promise<APIResponse<ImportJob>> => {
  if (!file || typeof (file as any).arrayBuffer !== "function") {
    throw new AppError("Please Provide File", 400);
  }

  let parsed: ImportParams = {};
  if (typeof params === "string") {
    try {
      parsed = JSON.parse(params || "{}");
    } catch (error: any) {
      throw new AppError(`Invalid import params: ${error?.message || "bad json"}`, 400);
    }
  } else if (params && typeof params === "object") {
    parsed = params as ImportParams;
  }

  const mode = parsed.mode || "subscribe";
  if (mode !== "subscribe" && mode !== "blocklist") {
    throw new AppError("Invalid import mode. Allowed: subscribe, blocklist", 400);
  }

  const delim = parsed.delim || ",";
  if (typeof delim !== "string" || delim.length !== 1) {
    throw new AppError("Invalid delimiter. Provide a single character", 400);
  }

  const lists = Array.isArray(parsed.lists)
    ? parsed.lists.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : [];
  const overwrite = !!parsed.overwrite;
  const subscriptionStatus =
    parsed.subscription_status ||
    (mode === "subscribe" ? SubscriptionStatus.unconfirmed : SubscriptionStatus.unsubscribed);

  const job = (await saveData("ImportJob", {
    name: (file as any).name || `import-${Date.now()}`,
    mode,
    delim,
    lists,
    total: 0,
    overwrite,
    imported: 0,
    status: "importing",
  })) as ImportJob;

  await addImportLog(job.id, `processing '${job.name}'`);

  const filename = String((file as any).name || "").toLowerCase();
  if (filename.endsWith(".zip")) {
    await addImportLog(job.id, "zip uploads are not supported in this build");
    await saveData("ImportJob", {
      ...job,
      status: "failed",
    });
    throw new AppError("ZIP import is not supported in this build. Upload CSV.", 400);
  }

  const text = new TextDecoder().decode(await (file as any).arrayBuffer());
  const rows = parseCSV(text, delim);
  if (rows.length === 0) {
    await saveData("ImportJob", { ...job, status: "failed" });
    await addImportLog(job.id, "empty file");
    throw new AppError("Empty CSV file", 400);
  }

  const headers = rows[0].map((h) => cleanHeader(h));
  const emailIdx = headers.indexOf("email");
  const nameIdx = headers.indexOf("name");
  const attrsIdx = Math.max(headers.indexOf("attributes"), headers.indexOf("attribs"));

  if (emailIdx < 0) {
    await saveData("ImportJob", { ...job, status: "failed" });
    await addImportLog(job.id, "'email' column not found");
    throw new AppError("'email' column not found", 400);
  }

  let imported = 0;
  const total = Math.max(rows.length - 1, 0);
  await saveData("ImportJob", {
    ...job,
    total,
  });

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i];
    const email = normalizeEmail(cols[emailIdx] || "");
    if (!email || !isValidEmail(email)) {
      await addImportLog(job.id, `skipping line ${i + 1}: invalid email`);
      continue;
    }

    const name = normalizeName(email, nameIdx >= 0 ? cols[nameIdx] : "");
    const attribs = parseAttributes(attrsIdx >= 0 ? cols[attrsIdx] : "");

    const existing = (await getOne("Subscriber", {
      where: { email },
      withDeleted: true,
    })) as Subscriber | null;

    let subscriber: Subscriber;
    if (!existing) {
      subscriber = (await saveData("Subscriber", {
        email,
        name,
        attribs,
        status: mode === "blocklist" ? SubscriberStatus.blocklisted : SubscriberStatus.enabled,
        is_deleted: false,
      })) as Subscriber;
    } else {
      const payload: Partial<Subscriber> = {
        ...existing,
        id: existing.id,
        is_deleted: false,
      };

      if (mode === "blocklist") {
        payload.status = SubscriberStatus.blocklisted;
      }

      if (overwrite || mode === "blocklist") {
        payload.name = name;
        payload.attribs = attribs;
      }

      subscriber = (await saveData("Subscriber", payload)) as Subscriber;
    }

    if (mode === "subscribe" && lists.length > 0) {
      for (const listId of lists) {
        const existingSubList = (await getOne("SubscriberList", {
          where: { subscriber_id: subscriber.id, list_id: listId },
          withDeleted: true,
        })) as any;

        if (!existingSubList) {
          await saveData("SubscriberList", {
            subscriber_id: subscriber.id,
            list_id: listId,
            status: subscriptionStatus,
            meta: {},
            is_deleted: false,
          });
        } else if (overwrite || existingSubList.is_deleted) {
          await saveData("SubscriberList", {
            ...existingSubList,
            id: existingSubList.id,
            status: subscriptionStatus,
            is_deleted: false,
            meta: existingSubList.meta || {},
          });
        }
      }
    }

    imported++;
  }

  const status = "finished";
  await saveData("ImportJob", {
    ...job,
    imported,
    total,
    status,
  });
  await addImportLog(job.id, `imported ${imported} of ${total}`);
  await addImportLog(job.id, "import finished");

  return {
    data: {
      ...job,
      imported,
      total,
      status,
    } as ImportJob,
    message: "Import Started Successfully",
    success: true,
  };
};

export const StopImportSubscribers = async (): Promise<APIResponse<ImportJob | Record<string, unknown>>> => {
  const latest = (await getOne("ImportJob", {
    where: {},
    order: { created_at: "DESC" },
  })) as ImportJob | null;

  if (latest) {
    await saveData("ImportJob", {
      ...latest,
      status: latest.status === "importing" ? "stopped" : "none",
    });

    await addImportLog(latest.id, "import stopped");

    const updated = (await getOne("ImportJob", {
      where: { id: latest.id },
    })) as ImportJob;
    return {
      data: updated,
      message: "Import Stopped Successfully",
      success: true,
    };
  }

  return {
    data: DEFAULT_STATUS,
    message: "Import Stopped Successfully",
    success: true,
  };
};
