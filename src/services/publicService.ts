import { getMany, getOne, rawQuery, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Campaign from "../models/Campaign";
import List from "../models/List";
import Subscriber from "../models/Subscriber";
import Link from "../models/Link";
import { ListStatus, ListType, SubscriptionStatus, SubscriberStatus } from "../types/constants";
import { AppError } from "../../libs/Errors";

const omitId = <T extends { id?: unknown }>(item: T): Omit<T, "id"> => {
  const { id: _id, ...rest } = item as any;
  return rest as Omit<T, "id">;
};

export const GetPublicLists = async (): Promise<APIResponse<Array<Omit<List, "id">>>> => {
  const lists = (await getMany("List", {
    where: {
      type: ListType.public,
      status: ListStatus.active,
    },
    order: { name: "ASC" },
  })) as List[];

  return {
    data: lists.map((list) => omitId(list)),
    message: "Public Lists Retrieved Successfully",
    success: true,
  };
};

export const PublicSubscription = async (body: {
  email: string;
  name?: string;
  list_uuids: string[];
}): Promise<APIResponse<Omit<Subscriber, "id">>> => {
  const subscriber = (await saveData("Subscriber", {
    email: body.email.toLowerCase(),
    name: body.name || body.email.split("@")[0],
    status: SubscriberStatus.enabled,
  })) as Subscriber;

  const lists = (await getMany("List", {
    where: {
      "uuid IN": body.list_uuids,
      type: ListType.public,
      status: ListStatus.active,
    },
  })) as List[];

  await Promise.all(
    lists.map(async (list) => {
      await saveData("SubscriberList", {
        subscriber_id: subscriber.id,
        list_id: list.id,
        status: SubscriptionStatus.confirmed,
        meta: {},
      });
    }),
  );

  return {
    data: omitId(subscriber),
    message: "Subscription Created Successfully",
    success: true,
  };
};

export const GetAltchaCaptchaChallenge = async (): Promise<
  APIResponse<{ algorithm: string; challenge: string; salt: string }>
> => {
  return {
    data: {
      algorithm: "SHA-256",
      challenge: `${Date.now()}`,
      salt: "listmonk-email-only",
    },
    message: "Captcha Challenge Retrieved Successfully",
    success: true,
  };
};

export const GetPublicCampaignArchives = async (): Promise<
  APIResponse<Array<Omit<Campaign, "id">>>
> => {
  const archives = (await getMany("Campaign", {
    where: {
      archive: true,
      status: "finished",
    },
    order: { updated_at: "DESC" },
    limit: 100,
  })) as Campaign[];

  return {
    data: archives.map((campaign) => omitId(campaign)),
    message: "Public Archives Retrieved Successfully",
    success: true,
  };
};

export const TrackLinkClick = async (linkUuid: string): Promise<{ url: string }> => {
  const link = (await getOne("Link", {
    where: { uuid: linkUuid, is_deleted: false },
  })) as Link | null;

  if (!link) {
    throw new AppError("Link not found", 404);
  }

  // Record the click
  await saveData("LinkClick", {
    link_id: link.id,
    campaign_id: link.campaign_id ?? null,
  });

  // Increment campaign clicks counter (atomic)
  if (link.campaign_id) {
    await rawQuery(
      `UPDATE campaigns SET clicks = clicks + 1 WHERE id = ${Number(link.campaign_id)} AND is_deleted = false`,
    );
  }

  return { url: link.url };
};
