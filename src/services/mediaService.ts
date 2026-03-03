import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { AppError } from "../../libs/Errors";
import { getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Media from "../models/Media";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const sanitizeFilename = (filename: string) => {
  const ext = path.extname(filename || "").toLowerCase();
  const base = path
    .basename(filename || `file-${Date.now()}`)
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  const cleaned = base.length > 0 ? base : `file-${Date.now()}${ext}`;
  return cleaned;
};

const fileExistsByName = async (filename: string) => {
  const existing = (await getOne("Media", {
    where: { filename },
  })) as Media | null;
  return !!existing;
};

const uniqueFilename = async (filename: string) => {
  if (!(await fileExistsByName(filename))) {
    return filename;
  }

  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = filename;
  let counter = 1;
  while (await fileExistsByName(candidate)) {
    candidate = `${base}-${Date.now()}-${counter}${ext}`;
    counter++;
  }
  return candidate;
};

const toPublicURL = (filename: string, requestUrl?: string) => {
  const pathname = `/uploads/${filename}`;
  if (!requestUrl) {
    return pathname;
  }

  const u = new URL(requestUrl);
  return `${u.protocol}//${u.host}${pathname}`;
};

const mapMediaResponse = (media: Media, requestUrl?: string) => {
  return {
    id: media.id,
    uuid: media.uuid,
    filename: media.filename,
    content_type: media.content_type,
    created_at: media.created_at,
    thumb_url: media.thumb ? toPublicURL(media.thumb, requestUrl) : null,
    provider: media.provider,
    meta: media.meta || {},
    url: toPublicURL(media.filename, requestUrl),
  };
};

export const GetMedia = async ({
  query,
  page = 1,
  per_page = 50,
}: {
  query?: string;
  page?: number;
  per_page?: number | "all";
},
requestUrl?: string): Promise<APIResponse<any[]>> => {
  const limit = per_page === "all" ? undefined : per_page;

  const media = (await getMany("Media", {
    where: {
      ...(query ? { "filename LIKE": `%${query}%` } : {}),
    },
    limit,
    skip: limit ? (page - 1) * limit : undefined,
    order: { created_at: "DESC" },
  })) as Media[];

  return {
    data: media.map((item) => mapMediaResponse(item, requestUrl)),
    message: "Media Retrieved Successfully",
    success: true,
  };
};

export const GetOneMedia = async (id: number, requestUrl?: string): Promise<APIResponse<any>> => {
  const media = (await getOne("Media", {
    where: { id },
  })) as Media;

  if (!media) {
    throw new AppError("Media not found", 404);
  }

  return {
    data: mapMediaResponse(media, requestUrl),
    message: "Media Retrieved Successfully",
    success: true,
  };
};

export const UploadMedia = async (body: {
  file?: File | Blob | { name?: string; type?: string; arrayBuffer?: () => Promise<ArrayBuffer> };
},
requestUrl?: string): Promise<APIResponse<any>> => {
  if (!body.file || typeof (body.file as any).arrayBuffer !== "function") {
    throw new AppError("Please Provide File", 400);
  }

  const file = body.file as File;
  const sourceName = (file as any).name || `file-${Date.now()}`;
  const cleaned = sanitizeFilename(sourceName);
  const filename = await uniqueFilename(cleaned);
  const contentType = (file as any).type || "application/octet-stream";
  const provider = "filesystem";
  const thumb = filename;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, filename);
  const bytes = await file.arrayBuffer();
  await Bun.write(filePath, bytes);

  const created = (await saveData("Media", {
    filename,
    content_type: contentType,
    provider,
    thumb,
    meta: {},
  })) as Media;

  return {
    data: mapMediaResponse(created, requestUrl),
    message: "Media Uploaded Successfully",
    success: true,
  };
};

export const DeleteMedia = async (id: number): Promise<APIResponse<boolean>> => {
  const media = (await getOne("Media", {
    where: { id },
    withDeleted: true,
  })) as Media | null;

  if (!media) {
    return {
      data: true,
      message: "Media Deleted Successfully",
      success: true,
    };
  }

  const primaryPath = path.join(UPLOAD_DIR, media.filename);
  const thumbPath = media.thumb ? path.join(UPLOAD_DIR, media.thumb) : "";
  await unlink(primaryPath).catch(() => {});
  if (thumbPath && thumbPath !== primaryPath) {
    await unlink(thumbPath).catch(() => {});
  }

  await saveData("Media", {
    ...media,
    is_deleted: true,
  });

  return {
    data: true,
    message: "Media Deleted Successfully",
    success: true,
  };
};
