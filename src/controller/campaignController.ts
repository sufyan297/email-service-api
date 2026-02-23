import type { AppInstance } from "../../index";
import {
  GetCampaignsDTO,
  GetCampaignDTO,
  CampaignPreviewDTO,
  CampaignStatsDTO,
  CampaignAnalyticsDTO,
  CreateCampaignDTO,
  TestCampaignDTO,
  UpdateCampaignDTO,
  ChangeCampaignStatusDTO,
  PublishCampaignDTO,
  DeleteCampaignDTO,
  DeleteMultipleCampaignsDTO,
} from "../dto/campaign";

export const CampaignController = (app: AppInstance) => {
  app.group("/campaigns", (app) =>
    app
      .get("", async () => {}, {
        detail: { tags: ["Campaign"], description: "Retrieve all campaigns" },
        body: GetCampaignsDTO,
      })
      .get("/:id", async () => {}, {
        detail: { tags: ["Campaign"], description: "Retrieve a specific campaign" },
        body: GetCampaignDTO,
      })
      .get("/:id/preview", async () => {}, {
        detail: { tags: ["Campaign"], description: "Retrieve preview of a campaign" },
        body: CampaignPreviewDTO,
      })
      .get("/running/stats", async () => {}, {
        detail: { tags: ["Campaign"], description: "Retrieve stats of specified campaigns" },
        body: CampaignStatsDTO,
      })
      .get("/analytics/:type", async () => {}, {
        detail: { tags: ["Campaign"], description: "Retrieve analytics for campaigns" },
        body: CampaignAnalyticsDTO,
      })
      .post("", async () => {}, {
        detail: { tags: ["Campaign"], description: "Create a new campaign" },
        body: CreateCampaignDTO,
      })
      .post("/:id/test", async () => {}, {
        detail: { tags: ["Campaign"], description: "Test campaign with arbitrary subscribers" },
        body: TestCampaignDTO,
      })
      .put("/:id", async () => {}, {
        detail: { tags: ["Campaign"], description: "Update a campaign" },
        body: UpdateCampaignDTO,
      })
      .put("/:id/status", async () => {}, {
        detail: { tags: ["Campaign"], description: "Change status of a campaign" },
        body: ChangeCampaignStatusDTO,
      })
      .put("/:id/status", async () => {}, {
        detail: { tags: ["Campaign"], description: "Publish campaign to public archive" },
        body: PublishCampaignDTO,
      })
      .delete("/:id", async () => {}, {
        detail: { tags: ["Campaign"], description: "Delete a campaign" },
        body: DeleteCampaignDTO,
      })
      .delete("", async () => {}, {
        detail: { tags: ["Campaign"], description: "Delete multiple campaigns" },
        body: DeleteMultipleCampaignsDTO,
      }),
  );
};
