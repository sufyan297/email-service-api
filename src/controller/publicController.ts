import type { AppInstance } from "../../index";
import { CreatePublicSubscriptionDTO } from "../dto/public";

export const PublicController = (app: AppInstance) => {
  app.group("/public", (app) =>
    app
      .post("/subscription", async () => {}, {
        detail: { tags: ["Public"], description: "Create a public subscription" },
        body: CreatePublicSubscriptionDTO,
      })
      .get("/lists", async () => {}, {
        detail: { tags: ["Public"], description: "Retrieve public lists" },
      }),
  );
};
