import type { AppInstance } from "../../index";
import { ChangePasswordDTO, LoginDTO } from "../dto/auth";
import AdminAuth from "../middleware/admin_auth";
import { ChangePassword, Login, Logout } from "../services/authService";
import User from "../models/User";

export const AuthController = (app: AppInstance) => {
  app.group("/api", (app) =>
    app
      .post(
        "/login",
        async ({ body, jwt }) => {
          return await Login({ body, jwt });
        },
        {
          detail: { tags: ["Auth"], description: "User Login" },
          body: LoginDTO,
        },
      )
      .post(
        "/admin/reload",
        async () => {
          return {
            data: { needs_restart: false },
            message: "Reload Triggered Successfully",
            success: true,
          };
        },
        {
          detail: { tags: ["Auth"], description: "Reload app config" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/profile/password",
        async ({ body, set }) => {
          const { user }: { user: User } = set as any;
          return await ChangePassword({ body, user });
        },
        {
          detail: { tags: ["Auth"], description: "Change password for current user" },
          beforeHandle: AdminAuth,
          body: ChangePasswordDTO,
        },
      )
      .post(
        "/logout",
        async () => {
          return await Logout();
        },
        {
          detail: { tags: ["Auth"], description: "Logout current user" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
