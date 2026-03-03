import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import User from "../models/User";
import { Order } from "../types/constants";
import { hash } from "bcrypt";

export const GetUsers = async ({
  page = 1,
  per_page = 50,
  query,
  status,
  order_by = "created_at",
  order = Order.desc,
}: {
  page?: number;
  per_page?: number;
  query?: string;
  status?: string;
  order_by?: "username" | "created_at";
  order?: Order;
}): Promise<APIResponse<User[]>> => {
  const users = (await getMany("User", {
    where: {
      ...(query && { "username LIKE": `%${query}%` }),
      ...(status && { status }),
    },
    limit: per_page,
    skip: (page - 1) * per_page,
    order: { [order_by]: order },
  })) as User[];

  return {
    data: users,
    message: "Users Retrieved Successfully",
    success: true,
  };
};

export const GetUser = async (id: number): Promise<APIResponse<User>> => {
  const user = (await getOne("User", {
    where: { id },
  })) as User;

  return {
    data: user,
    message: "User Retrieved Successfully",
    success: true,
  };
};

export const CreateUser = async (body: Partial<User>): Promise<APIResponse<User>> => {
  const usernameExists = await getCount("User", {
    where: { username: body.username },
  });
  if (usernameExists > 0) {
    throw new AppError("Username Already Exists", 409);
  }

  const emailExists = await getCount("User", {
    where: { email: body.email },
  });
  if (emailExists > 0) {
    throw new AppError("Email Already Exists", 409);
  }

  const created = (await saveData("User", {
    ...body,
    password: await hash(body.password || "changeme", 13),
  })) as User;

  return {
    data: created,
    message: "User Created Successfully",
    success: true,
  };
};

export const UpdateUser = async (
  id: number,
  body: Partial<User>,
): Promise<APIResponse<User>> => {
  const updatePayload: Partial<User> & { id: number } = {
    id,
    ...body,
  };

  if (body.password) {
    updatePayload.password = await hash(body.password, 13);
  }

  const updated = (await saveData("User", updatePayload)) as User;
  return {
    data: updated,
    message: "User Updated Successfully",
    success: true,
  };
};

export const DeleteUser = async (id: number): Promise<APIResponse<boolean>> => {
  await saveData("User", {
    id,
    is_deleted: true,
  });

  return {
    data: true,
    message: "User Deleted Successfully",
    success: true,
  };
};

export const DeleteManyUsers = async (ids: number[]): Promise<APIResponse<boolean>> => {
  await Promise.all(
    ids.map(async (id) => {
      await saveData("User", {
        id,
        is_deleted: true,
      });
    }),
  );

  return {
    data: true,
    message: "Users Deleted Successfully",
    success: true,
  };
};

export const GenerateTOTPForUser = async (id: number): Promise<APIResponse<{ key: string }>> => {
  const key = `totp-${id}-${Date.now()}`;
  await saveData("User", {
    id,
    twofa_key: key,
  });

  return {
    data: { key },
    message: "TOTP Key Generated Successfully",
    success: true,
  };
};

export const EnableUserTOTP = async (id: number, key: string): Promise<APIResponse<boolean>> => {
  await saveData("User", {
    id,
    twofa_type: "totp",
    twofa_key: key,
  });

  return {
    data: true,
    message: "TOTP Enabled Successfully",
    success: true,
  };
};

export const DisableUserTOTP = async (id: number): Promise<APIResponse<boolean>> => {
  await saveData("User", {
    id,
    twofa_type: "none",
    twofa_key: null,
  });

  return {
    data: true,
    message: "TOTP Disabled Successfully",
    success: true,
  };
};
