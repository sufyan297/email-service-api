import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Template from "../models/Template";
import { TemplateType } from "../types/constants";

export const GetTemplates = async ({
  page = 1,
  per_page = 50,
}: {
  page?: number;
  per_page?: number | "all";
}): Promise<APIResponse<Template[]>> => {
  const limit = per_page === "all" ? undefined : per_page;

  const templates = (await getMany("Template", {
    where: {},
    limit,
    skip: limit ? (page - 1) * limit : undefined,
    order: { created_at: "DESC" },
  })) as Template[];

  return {
    data: templates,
    message: "Templates Retrieved Successfully",
    success: true,
  };
};

export const GetTemplate = async (id: number): Promise<APIResponse<Template>> => {
  const template = (await getOne("Template", {
    where: { id },
  })) as Template;

  return {
    data: template,
    message: "Template Retrieved Successfully",
    success: true,
  };
};

export const CreateTemplate = async (body: Partial<Template>): Promise<APIResponse<Template>> => {
  const exists = await getCount("Template", {
    where: { name: body.name },
  });
  if (exists > 0) {
    throw new AppError("Template Already Exists", 409);
  }

  const created = (await saveData("Template", {
    ...body,
    type: body.type || TemplateType.campaign,
  })) as Template;

  return {
    data: created,
    message: "Template Created Successfully",
    success: true,
  };
};

export const UpdateTemplate = async (
  id: number,
  body: Partial<Template>,
): Promise<APIResponse<Template>> => {
  const updated = (await saveData("Template", {
    id,
    ...body,
  })) as Template;
  const template = (await getOne("Template", {
    where: { id: updated.id },
  })) as Template;

  return {
    data: template,
    message: "Template Updated Successfully",
    success: true,
  };
};

export const SetDefaultTemplate = async (id: number): Promise<APIResponse<Template>> => {
  const all = (await getMany("Template", {
    where: { is_default: true },
  })) as Template[];

  await Promise.all(
    all.map(async (template) => {
      await saveData("Template", {
        id: template.id,
        is_default: false,
      });
    }),
  );

  const updated = (await saveData("Template", {
    id,
    is_default: true,
  })) as Template;
  const template = (await getOne("Template", {
    where: { id: updated.id },
  })) as Template;

  return {
    data: template,
    message: "Default Template Updated Successfully",
    success: true,
  };
};

export const DeleteTemplate = async (id: number): Promise<APIResponse<boolean>> => {
  await saveData("Template", {
    id,
    is_deleted: true,
    is_default: false,
  });

  return {
    data: true,
    message: "Template Deleted Successfully",
    success: true,
  };
};

export const PreviewTemplate = async (
  body: Partial<Template>,
): Promise<APIResponse<{ html: string }>> => {
  return {
    data: { html: body.body || "" },
    message: "Template Preview Generated Successfully",
    success: true,
  };
};
