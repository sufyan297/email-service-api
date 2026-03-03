import type { AppInstance } from "../../index";
import {
  TestSMTPSettingsDTO,
  UpdateSettingByKeyDTO,
  UpdateSettingsDTO,
} from "../dto/settings";
import AdminAuth from "../middleware/admin_auth";
import {
  GetSettings,
  TestSMTPSettings,
  UpdateSettings,
  UpdateSettingsByKey,
} from "../services/settingsService";

export const SettingsController = (app: AppInstance) => {
  app.group("/api/settings", (app) =>
    app
      .get(
        "",
        async () => {
          return await GetSettings();
        },
        {
          detail: { tags: ["Settings"], description: "Get settings" },
          beforeHandle: AdminAuth,
        },
      )
      .patch(
        "",
        async ({ body }) => {
          return await UpdateSettings(body as Record<string, unknown>);
        },
        {
          detail: { tags: ["Settings"], description: "Update settings" },
          beforeHandle: AdminAuth,
          body: UpdateSettingsDTO,
        },
      )
      .put(
        "",
        async ({ body }) => {
          return await UpdateSettings(body as Record<string, unknown>);
        },
        {
          detail: { tags: ["Settings"], description: "Update settings" },
          beforeHandle: AdminAuth,
          body: UpdateSettingsDTO,
        },
      )
      .patch(
        "/:key",
        async ({ params, body }) => {
          return await UpdateSettingsByKey(params.key, body.value);
        },
        {
          detail: { tags: ["Settings"], description: "Update setting by key" },
          beforeHandle: AdminAuth,
          body: UpdateSettingByKeyDTO,
        },
      )
      .put(
        "/:key",
        async ({ params, body }) => {
          return await UpdateSettingsByKey(params.key, body.value);
        },
        {
          detail: { tags: ["Settings"], description: "Update setting by key" },
          beforeHandle: AdminAuth,
          body: UpdateSettingByKeyDTO,
        },
      )
      .post(
        "/smtp/test",
        async ({ body }) => {
          return await TestSMTPSettings(body);
        },
        {
          detail: { tags: ["Settings"], description: "Test SMTP settings" },
          beforeHandle: AdminAuth,
          body: TestSMTPSettingsDTO,
        },
      ),
  );
};
