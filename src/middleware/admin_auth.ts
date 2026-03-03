import { UnAuthorizedAccessException } from "../../libs/Errors";
import { getOne } from "../../libs/Query";
import User from "../models/User";
import { UserStatus } from "../types/constants";

export default async ({ bearer, jwt, set }: any) => {
  try {
    if (!bearer) throw new UnAuthorizedAccessException("Unauthorized access!");

    const payload = await jwt.verify(bearer);
    if (!payload) throw new UnAuthorizedAccessException("Invalid Token");

    let { sub } = payload;

    if (!sub) throw new UnAuthorizedAccessException("Invalid Token");

    const user = await getOne<User>("User", {
      where: {
        id: sub,
        status: UserStatus.enabled,
      },
    });

    if (!user) throw new UnAuthorizedAccessException("Cannot Verify Session");

    set.user = user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
