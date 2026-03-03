import type { AppInstance } from "../../index";
import { CreatePublicSubscriptionDTO } from "../dto/public";
import {
  GetAltchaCaptchaChallenge,
  GetPublicCampaignArchives,
  GetPublicLists,
  PublicSubscription,
} from "../services/publicService";

export const PublicController = (app: AppInstance) => {
  app.group("/api/public", (app) =>
    app
      .get(
        "/lists",
        async () => {
          return await GetPublicLists();
        },
        {
          detail: { tags: ["Public"], description: "Retrieve public lists" },
        },
      )
      .post(
        "/subscription",
        async ({ body }) => {
          return await PublicSubscription({
            ...body,
            list_uuids: body.list_uuids || (Array.isArray(body.l) ? body.l : body.l ? [body.l] : []),
          });
        },
        {
          detail: { tags: ["Public"], description: "Create a public subscription" },
          body: CreatePublicSubscriptionDTO,
        },
      )
      .get(
        "/captcha/altcha",
        async () => {
          return await GetAltchaCaptchaChallenge();
        },
        {
          detail: { tags: ["Public"], description: "Get captcha challenge" },
        },
      )
      .get(
        "/archive",
        async () => {
          return await GetPublicCampaignArchives();
        },
        {
          detail: { tags: ["Public"], description: "Get public archives" },
        },
      ),
  );
};
