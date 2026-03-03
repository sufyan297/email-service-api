import { t } from "elysia";
import { TwoFAType, UserStatus, UserType } from "../types/constants";

export const GetUsersDTO = t.Optional(
  t.Object({
    page: t.Optional(t.Integer()),
    per_page: t.Optional(t.Integer({ minimum: 1, maximum: 1000 })),
    query: t.Optional(t.String()),
    status: t.Optional(t.Enum(UserStatus)),
    order_by: t.Optional(t.Enum({ username: "username", created_at: "created_at" })),
    order: t.Optional(t.Enum({ ASC: "ASC", DESC: "DESC" })),
  }),
);

export const CreateUserDTO = t.Object({
  username: t.String(),
  password: t.String(),
  email: t.String(),
  name: t.String(),
  type: t.Optional(t.Enum(UserType)),
  status: t.Optional(t.Enum(UserStatus)),
});

export const UpdateUserDTO = t.Object({
  username: t.Optional(t.String()),
  password: t.Optional(t.String()),
  email: t.Optional(t.String()),
  name: t.Optional(t.String()),
  avatar: t.Optional(t.String()),
  type: t.Optional(t.Enum(UserType)),
  status: t.Optional(t.Enum(UserStatus)),
  twofa_type: t.Optional(t.Enum(TwoFAType)),
  twofa_key: t.Optional(t.String()),
});

export const DeleteManyUsersDTO = t.Object({
  user_ids: t.Array(t.Integer()),
});
