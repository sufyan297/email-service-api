import { getMany, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Campaign from "../models/Campaign";
import List from "../models/List";
import Subscriber from "../models/Subscriber";
import { ListStatus, ListType, SubscriptionStatus, SubscriberStatus } from "../types/constants";

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
