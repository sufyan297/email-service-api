import { compare, hash } from "bcrypt";
import { BadRequestException, ResourceNotFoundException, UnAuthorizedAccessException } from "../../libs/Errors";
import { getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import User from "../models/User";
import { UserStatus } from "../types/constants";

export const Login = async ({
  body,
  jwt,
}: {
  body: { username: string; password: string };
  jwt: any;
}): Promise<APIResponse<{ user: User; token: string }>> => {
  const user = (await getOne<User>("User", {
    where: { username: body.username, status: UserStatus.enabled },
  })) as User;

  if (!user) {
    throw new ResourceNotFoundException("Cannot Find User");
  }

  const match = await compare(body.password, user.password);
  if (!match) {
    throw new UnAuthorizedAccessException("Credentials Did Not Match");
  }

  const token = await jwt.sign({ sub: user.id });

  await saveData("User", {
    id: user.id,
    loggedin_at: new Date(),
  });

  return {
    data: { user, token },
    message: "Logged In Successfully",
    success: true,
  };
};

export const ChangePassword = async ({
  body,
  user,
}: {
  body: { password: string; new_password: string };
  user: User;
}): Promise<APIResponse<boolean>> => {
  const match = await compare(body.password, user.password);
  if (!match) {
    throw new BadRequestException("Old Password Did Not Match");
  }

  await saveData("User", {
    id: user.id,
    password: await hash(body.new_password, 13),
  });

  return {
    data: true,
    message: "Password Updated Successfully",
    success: true,
  };
};

export const Logout = async (): Promise<APIResponse<boolean>> => {
  return {
    data: true,
    message: "Logged Out Successfully",
    success: true,
  };
};

export const GetProfile = async (user: User): Promise<APIResponse<User>> => {
  const profile = (await getOne<User>("User", {
    where: { id: user.id },
  })) as User;

  return {
    data: profile,
    message: "Profile Retrieved Successfully",
    success: true,
  };
};

export const UpdateProfile = async (
  user: User,
  body: Partial<User>,
): Promise<APIResponse<User>> => {
  const updated = (await saveData("User", {
    id: user.id,
    name: body.name ?? user.name,
    email: body.email ?? user.email,
    avatar: body.avatar ?? user.avatar,
  })) as User;

  return {
    data: updated,
    message: "Profile Updated Successfully",
    success: true,
  };
};
