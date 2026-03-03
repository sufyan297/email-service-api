import type { AppInstance } from "../../index";
import { CreateUserDTO, DeleteManyUsersDTO, GetUsersDTO, UpdateUserDTO } from "../dto/user";
import AdminAuth from "../middleware/admin_auth";
import User from "../models/User";
import {
  CreateUser,
  DeleteManyUsers,
  DeleteUser,
  DisableUserTOTP,
  EnableUserTOTP,
  GenerateTOTPForUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from "../services/userService";
import { GetProfile, UpdateProfile } from "../services/authService";

export const UserController = (app: AppInstance) => {
  app.group("/api", (app) =>
    app
      .get(
        "/profile",
        async ({ set }) => {
          const { user }: { user: User } = set as any;
          return await GetProfile(user);
        },
        {
          detail: { tags: ["User"], description: "Get current profile" },
          beforeHandle: AdminAuth,
        },
      )
      .patch(
        "/profile",
        async ({ set, body }) => {
          const { user }: { user: User } = set as any;
          return await UpdateProfile(user, body as Partial<User>);
        },
        {
          detail: { tags: ["User"], description: "Update current profile" },
          beforeHandle: AdminAuth,
          body: UpdateUserDTO,
        },
      )
      .get(
        "/users",
        async ({ query }) => {
          return await GetUsers(query);
        },
        {
          detail: { tags: ["User"], description: "Get users" },
          beforeHandle: AdminAuth,
          query: GetUsersDTO,
        },
      )
      .get(
        "/users/:id",
        async ({ params }) => {
          return await GetUser(Number(params.id));
        },
        {
          detail: { tags: ["User"], description: "Get specific user" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "/users",
        async ({ body }) => {
          return await CreateUser(body);
        },
        {
          detail: { tags: ["User"], description: "Create user" },
          beforeHandle: AdminAuth,
          body: CreateUserDTO,
        },
      )
      .patch(
        "/users/:id",
        async ({ params, body }) => {
          return await UpdateUser(Number(params.id), body);
        },
        {
          detail: { tags: ["User"], description: "Update user" },
          beforeHandle: AdminAuth,
          body: UpdateUserDTO,
        },
      )
      .delete(
        "/users/:id",
        async ({ params }) => {
          return await DeleteUser(Number(params.id));
        },
        {
          detail: { tags: ["User"], description: "Delete user" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/users",
        async ({ body }) => {
          return await DeleteManyUsers(body.user_ids);
        },
        {
          detail: { tags: ["User"], description: "Delete many users" },
          beforeHandle: AdminAuth,
          body: DeleteManyUsersDTO,
        },
      )
      .get(
        "/users/:id/twofa/totp",
        async ({ params }) => {
          return await GenerateTOTPForUser(Number(params.id));
        },
        {
          detail: { tags: ["User"], description: "Generate TOTP for user" },
          beforeHandle: AdminAuth,
        },
      )
      .patch(
        "/users/:id/twofa",
        async ({ params, body }) => {
          return await EnableUserTOTP(Number(params.id), body?.key || "");
        },
        {
          detail: { tags: ["User"], description: "Enable TOTP for user" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/users/:id/twofa",
        async ({ params }) => {
          return await DisableUserTOTP(Number(params.id));
        },
        {
          detail: { tags: ["User"], description: "Disable TOTP for user" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
