import { t } from "elysia";

export const LoginDTO = t.Object({
  username: t.String({
    description: "Username",
    error: "Please Provide Username",
  }),
  password: t.String({
    description: "Password",
    error: "Please Provide Password",
  }),
});

export const ChangePasswordDTO = t.Object({
  password: t.String({
    description: "Current password",
    error: "Please Provide Password",
  }),
  new_password: t.String({
    description: "New password",
    error: "Please Provide New Password",
  }),
});
