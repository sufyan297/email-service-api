import type { AppInstance } from "../../index";
import AdminAuth from "../middleware/admin_auth";
import {
  GetImportSubscriberLogs,
  GetImportSubscribers,
  ImportSubscribers,
  StopImportSubscribers,
} from "../services/importService";

export const ImportController = (app: AppInstance) => {
  app.group("/api/import/subscribers", (app) =>
    app
      .get(
        "",
        async () => {
          return await GetImportSubscribers();
        },
        {
          detail: { tags: ["Import"], description: "Get import subscribers stats" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/logs",
        async () => {
          return await GetImportSubscriberLogs();
        },
        {
          detail: { tags: ["Import"], description: "Get import logs" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body }) => {
          const b: any = body as any;
          let params = b?.params;
          let file = b?.file;

          if (b && typeof b.get === "function") {
            const fp = b.get("params");
            const ff = b.get("file");
            params = fp ?? params;
            file = ff ?? file;
          }

          return await ImportSubscribers({
            params,
            file,
          });
        },
        {
          detail: { tags: ["Import"], description: "Start subscribers import" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "",
        async () => {
          return await StopImportSubscribers();
        },
        {
          detail: { tags: ["Import"], description: "Stop subscribers import" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
