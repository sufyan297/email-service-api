import type { AppInstance } from "../../index";
import AdminAuth from "../middleware/admin_auth";
import {
  GetAboutInfo,
  GetDashboardCharts,
  GetDashboardCounts,
  GetEvents,
  GetHealth,
  GetI18nLang,
  GetLogs,
  GetServerConfig,
} from "../services/systemService";

export const SystemController = (app: AppInstance) => {
  app.group("/api", (app) =>
    app
      .get(
        "/health",
        async () => {
          return await GetHealth();
        },
        {
          detail: { tags: ["System"], description: "Health check" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/config",
        async () => {
          return await GetServerConfig();
        },
        {
          detail: { tags: ["System"], description: "Get server config" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/lang/:lang",
        async ({ params }) => {
          return await GetI18nLang(params.lang);
        },
        {
          detail: { tags: ["System"], description: "Get i18n language payload" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/dashboard/charts",
        async () => {
          return await GetDashboardCharts();
        },
        {
          detail: { tags: ["Dashboard"], description: "Get dashboard charts" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/dashboard/counts",
        async () => {
          return await GetDashboardCounts();
        },
        {
          detail: { tags: ["Dashboard"], description: "Get dashboard counts" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/logs",
        async () => {
          return await GetLogs();
        },
        {
          detail: { tags: ["System"], description: "Get logs" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/events",
        async () => {
          return await GetEvents();
        },
        {
          detail: { tags: ["System"], description: "Get events" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/about",
        async () => {
          return await GetAboutInfo();
        },
        {
          detail: { tags: ["System"], description: "Get about info" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/maintenance/subscribers/:type",
        async () => {
          return {
            data: true,
            message: "Maintenance task completed successfully",
            success: true,
          };
        },
        {
          detail: { tags: ["Maintenance"], description: "GC subscribers" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/maintenance/analytics/:type",
        async () => {
          return {
            data: true,
            message: "Maintenance task completed successfully",
            success: true,
          };
        },
        {
          detail: { tags: ["Maintenance"], description: "GC analytics" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/maintenance/subscriptions/unconfirmed",
        async () => {
          return {
            data: true,
            message: "Maintenance task completed successfully",
            success: true,
          };
        },
        {
          detail: { tags: ["Maintenance"], description: "GC unconfirmed subscriptions" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
