import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import SMTPConfig from "../models/SMTPConfig";
import { GetManySMTPConfigsOptions } from "../types";
import { Order } from "../types/constants";

const GetManySMTPConfigs = async ({
  query,
  enabled,
  is_default,
  page = 1,
  per_page = 50,
  order_by = "created_at",
  order = Order.desc,
}: GetManySMTPConfigsOptions): Promise<APIResponse<SMTPConfig[]>> => {
  try {
    const smtpConfigs = (await getMany("SMTPConfig", {
      where: {
        ...(query && { "host LIKE": `%${query}%` }),
        ...(typeof enabled === "boolean" && { enabled }),
        ...(typeof is_default === "boolean" && { is_default }),
      },
      limit: per_page,
      skip: (page - 1) * per_page,
      order: { [order_by]: order },
    })) as SMTPConfig[];

    return {
      data: smtpConfigs,
      message: "SMTP configs retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GetOneSMTPConfig = async (smtpConfigId: number): Promise<APIResponse<SMTPConfig>> => {
  try {
    const smtpConfig = (await getOne("SMTPConfig", {
      where: {
        id: smtpConfigId,
      },
    })) as SMTPConfig;

    return {
      data: smtpConfig,
      message: "SMTP config retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const resetDefaultSMTPConfig = async (excludeId?: number) => {
  const existingDefaultConfigs = (await getMany("SMTPConfig", {
    where: {
      is_default: true,
      ...(excludeId && { "id !=": excludeId }),
    },
  })) as SMTPConfig[];

  await Promise.all(
    existingDefaultConfigs.map(async (smtpConfig) => {
      await saveData("SMTPConfig", {
        id: smtpConfig.id,
        is_default: false,
      });
    }),
  );
};

const CreateSMTPConfig = async (body: Partial<SMTPConfig>): Promise<APIResponse<SMTPConfig>> => {
  try {
    const existingSMTPConfig = await getCount("SMTPConfig", {
      where: {
        host: body.host,
        port: body.port,
        username: body.username,
      },
    });

    if (existingSMTPConfig > 0) {
      throw new AppError("SMTP Config Already Exists", 409);
    }

    if (body.is_default) {
      await resetDefaultSMTPConfig();
    }

    const newSMTPConfig = (await saveData<SMTPConfig>("SMTPConfig", {
      ...body,
    })) as SMTPConfig;

    return {
      data: newSMTPConfig,
      message: "SMTP config created successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const UpdateSMTPConfig = async (body: Partial<SMTPConfig>): Promise<APIResponse<SMTPConfig>> => {
  try {
    if (body.is_default && body.id) {
      await resetDefaultSMTPConfig(body.id);
    }

    const updatedSMTPConfig = (await saveData("SMTPConfig", {
      ...body,
    })) as SMTPConfig;

    return {
      data: updatedSMTPConfig,
      message: "SMTP config updated successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteOneSMTPConfig = async (smtpConfigId: number): Promise<APIResponse<boolean>> => {
  try {
    await saveData("SMTPConfig", {
      id: smtpConfigId,
      is_default: false,
      is_deleted: true,
    });

    return {
      data: true,
      message: "SMTP config deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteManySMTPConfigs = async (smtpConfigIds: number[]): Promise<APIResponse<boolean>> => {
  try {
    await Promise.all(
      smtpConfigIds.map(async (smtpConfigId) => {
        await saveData("SMTPConfig", {
          id: smtpConfigId,
          is_default: false,
          is_deleted: true,
        });
      }),
    );

    return {
      data: true,
      message: "SMTP configs deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  GetManySMTPConfigs,
  GetOneSMTPConfig,
  CreateSMTPConfig,
  UpdateSMTPConfig,
  DeleteOneSMTPConfig,
  DeleteManySMTPConfigs,
};
