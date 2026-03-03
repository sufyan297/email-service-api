import type { AppInstance } from "../../index";
import {
  CreateTemplateDTO,
  GetTemplatesDTO,
  PreviewTemplateDTO,
  UpdateTemplateDTO,
} from "../dto/template";
import AdminAuth from "../middleware/admin_auth";
import {
  CreateTemplate,
  DeleteTemplate,
  GetTemplate,
  GetTemplates,
  PreviewTemplate,
  SetDefaultTemplate,
  UpdateTemplate,
} from "../services/templateService";

export const TemplateController = (app: AppInstance) => {
  app.group("/api/templates", (app) =>
    app
      .get(
        "",
        async ({ query }) => {
          return await GetTemplates(query);
        },
        {
          detail: { tags: ["Template"], description: "Retrieve all templates" },
          beforeHandle: AdminAuth,
          query: GetTemplatesDTO,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          return await GetTemplate(Number(params.id));
        },
        {
          detail: { tags: ["Template"], description: "Retrieve a template" },
          beforeHandle: AdminAuth,
        },
      )
      .get(
        "/:id/preview",
        async ({ params }) => {
          const template = await GetTemplate(Number(params.id));
          return await PreviewTemplate(template.data as any);
        },
        {
          detail: { tags: ["Template"], description: "Retrieve template HTML preview" },
          beforeHandle: AdminAuth,
        },
      )
      .post(
        "",
        async ({ body }) => {
          return await CreateTemplate(body);
        },
        {
          detail: { tags: ["Template"], description: "Create a template" },
          beforeHandle: AdminAuth,
          body: CreateTemplateDTO,
        },
      )
      .post(
        "/preview",
        async ({ body }) => {
          return await PreviewTemplate(body);
        },
        {
          detail: { tags: ["Template"], description: "Render and preview a template" },
          beforeHandle: AdminAuth,
          body: PreviewTemplateDTO,
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await UpdateTemplate(Number(params.id), body);
        },
        {
          detail: { tags: ["Template"], description: "Update a template" },
          beforeHandle: AdminAuth,
          body: UpdateTemplateDTO,
        },
      )
      .put(
        "/:id",
        async ({ params, body }) => {
          return await UpdateTemplate(Number(params.id), body);
        },
        {
          detail: { tags: ["Template"], description: "Update a template" },
          beforeHandle: AdminAuth,
          body: UpdateTemplateDTO,
        },
      )
      .patch(
        "/:id/default",
        async ({ params }) => {
          return await SetDefaultTemplate(Number(params.id));
        },
        {
          detail: { tags: ["Template"], description: "Set default template" },
          beforeHandle: AdminAuth,
        },
      )
      .put(
        "/:id/default",
        async ({ params }) => {
          return await SetDefaultTemplate(Number(params.id));
        },
        {
          detail: { tags: ["Template"], description: "Set default template" },
          beforeHandle: AdminAuth,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await DeleteTemplate(Number(params.id));
        },
        {
          detail: { tags: ["Template"], description: "Delete a template" },
          beforeHandle: AdminAuth,
        },
      ),
  );
};
