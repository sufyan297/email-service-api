import os from "node:os";
import { getCount, rawQuery } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import { CampaignStatus, SubscriberStatus } from "../types/constants";

export const GetHealth = async (): Promise<APIResponse<boolean>> => {
  return {
    data: true,
    message: "OK",
    success: true,
  };
};

export const GetServerConfig = async (): Promise<APIResponse<Record<string, unknown>>> => {
  return {
    data: {
      name: "email-service-api",
      version: process.env.npm_package_version || "0.1.0",
      email_only: true,
    },
    message: "Config Retrieved Successfully",
    success: true,
  };
};

export const GetI18nLang = async (lang: string): Promise<APIResponse<{ lang: string }>> => {
  return {
    data: { lang },
    message: "Language Retrieved Successfully",
    success: true,
  };
};

export const GetDashboardCounts = async (): Promise<APIResponse<Record<string, unknown>>> => {
  const [
    totalSubscribers,
    blocklistedSubscribers,
    totalLists,
    publicLists,
    privateLists,
    totalCampaigns,
    draftCampaigns,
    runningCampaigns,
  ] = await Promise.all([
    getCount("Subscriber", {}),
    getCount("Subscriber", { where: { status: SubscriberStatus.blocklisted } }),
    getCount("List", {}),
    getCount("List", { where: { type: "public" } }),
    getCount("List", { where: { type: "private" } }),
    getCount("Campaign", {}),
    getCount("Campaign", { where: { status: CampaignStatus.draft } }),
    getCount("Campaign", { where: { status: CampaignStatus.running } }),
  ]);

  return {
    data: {
      subscribers: {
        total: totalSubscribers,
        blocklisted: blocklistedSubscribers,
      },
      lists: {
        total: totalLists,
        public: publicLists,
        private: privateLists,
      },
      campaigns: {
        total: totalCampaigns,
        by_status: {
          draft: draftCampaigns,
          running: runningCampaigns,
        },
      },
    },
    message: "Dashboard Counts Retrieved Successfully",
    success: true,
  };
};

export const GetDashboardCharts = async (): Promise<APIResponse<Record<string, unknown>>> => {
  const [linkClicks, campaignViews] = (await Promise.all([
    rawQuery(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM link_clicks WHERE is_deleted = false GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 30",
    ),
    rawQuery(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM campaign_views WHERE is_deleted = false GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 30",
    ),
  ])) as any[];

  return {
    data: {
      link_clicks: Array.isArray(linkClicks) ? linkClicks : [],
      campaign_views: Array.isArray(campaignViews) ? campaignViews : [],
    },
    message: "Dashboard Charts Retrieved Successfully",
    success: true,
  };
};

export const GetLogs = async (): Promise<APIResponse<string[]>> => {
  return {
    data: [],
    message: "Logs Retrieved Successfully",
    success: true,
  };
};

export const GetEvents = async (): Promise<APIResponse<unknown[]>> => {
  return {
    data: [],
    message: "Events Retrieved Successfully",
    success: true,
  };
};

export const GetAboutInfo = async (): Promise<APIResponse<Record<string, unknown>>> => {
  return {
    data: {
      version: process.env.npm_package_version || "0.1.0",
      node_version: process.version,
      host: {
        os: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
      system: {
        cpus: os.cpus().length,
        total_memory_mb: Math.round(os.totalmem() / 1024 / 1024),
        free_memory_mb: Math.round(os.freemem() / 1024 / 1024),
      },
    },
    message: "About Retrieved Successfully",
    success: true,
  };
};
