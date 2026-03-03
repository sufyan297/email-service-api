import type { AppInstance } from "../../index";
import {
  GetManySMTPConfigsDTO,
  CreateSMTPConfigDTO,
  UpdateSMTPConfigDTO,
  DeleteManySMTPConfigsDTO,
} from "../dto/smtp";
import AdminAuth from "../middleware/admin_auth";
import {
  CreateSMTPConfig,
  DeleteManySMTPConfigs,
  DeleteOneSMTPConfig,
  GetManySMTPConfigs,
  GetOneSMTPConfig,
  UpdateSMTPConfig,
} from "../services/smtpService";

export const SMTPController = (app: AppInstance) => {
  app.group("/api/smtp", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetManySMTPConfigs(query);
        },
        {
          detail: { tags: ["SMTP"], description: "Retrieve all SMTP configs" },
          beforeHandle: AdminAuth,
          query: GetManySMTPConfigsDTO,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetOneSMTPConfig(Number(params.id));
        },
        {
          detail: { tags: ["SMTP"], description: "Retrieve a specific SMTP config" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateSMTPConfig(body);
        },
        {
          detail: { tags: ["SMTP"], description: "Create a new SMTP config" },
          beforeHandle: AdminAuth,
          body: CreateSMTPConfigDTO,
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await UpdateSMTPConfig({ ...body, id: Number(params.id) });
        },
        {
          detail: { tags: ["SMTP"], description: "Update an SMTP config" },
          beforeHandle: AdminAuth,
          body: UpdateSMTPConfigDTO,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteOneSMTPConfig(Number(params.id));
        },
        {
          detail: { tags: ["SMTP"], description: "Delete an SMTP config" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "",
        async ({ body }) => {
          return await DeleteManySMTPConfigs(body.smtp_config_ids);
        },
        {
          detail: { tags: ["SMTP"], description: "Delete multiple SMTP configs" },
          beforeHandle: AdminAuth,
          body: DeleteManySMTPConfigsDTO,
        },
      ),
  );
};
