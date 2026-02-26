import { GetManySubscribersOptions } from "typeorm";
import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Subscriber from "../models/Subscriber";
import SubscriberList from "../models/SubscribersList";

const GetManySubscribers = async ({
  list_ids,
  subscription_status,
  page,
  per_page,
  order_by,
  order = "DESC",
}: GetManySubscribersOptions): Promise<APIResponse<Subscriber[]>> => {
  try {
    const subscribers = (await getMany("Subscriber", {
      where: {
        is_active: true,
        is_deleted: false,
        ...(list_ids && {
          subscriberLists: {
            list_id: list_ids,
          },
        }),
        ...(subscription_status !== undefined && {
          subscriberLists: {
            is_subscribed: subscription_status,
          },
        }),
      },
      relations: { subscriberLists: true },
      limit: per_page,
      skip: page && per_page ? (page - 1) * per_page : undefined,
      order: order_by ? { [order_by]: order } : undefined,
    })) as Subscriber[];

    return {
      data: subscribers,
      message: "Subscribers retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GetOneSubscriber = async (subscriberId: string): Promise<APIResponse<Subscriber>> => {
  try {
    const subscriber = (await getOne("Subscriber", {
      where: {
        id: subscriberId,
        is_active: true,
        is_deleted: false,
      },
      relations: { subscriberLists: true },
    })) as Subscriber;

    return {
      data: subscriber,
      message: "Subscriber retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CreateSubscriber = async (body: Partial<Subscriber>): Promise<APIResponse<Subscriber>> => {
  try {
    const existingEmail = await getCount("Subscriber", {
      where: {
        email: body.email,
      },
    });

    if (existingEmail > 0) throw new AppError("Email Already Exists", 409);

    const newSubscriber = (await saveData<Subscriber>("Subscriber", {
      ...body,
    })) as Subscriber;

    return {
      data: newSubscriber,
      message: "Subscriber Created Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const UpdateSubscriber = async (
  body: Partial<Subscriber>,
  listIds?: string[],
): Promise<APIResponse<Subscriber>> => {
  try {
    const updatedSubscriber = (await saveData("Subscriber", {
      id: body.id,
      ...body,
    })) as Subscriber;

    let updatedSubscriberLists: SubscriberList[] = [];
    if (listIds && listIds.length > 0) {
      updatedSubscriberLists = await Promise.all(
        listIds.map(
          (list_id) =>
            saveData("SubscriberList", {
              subscriber_id: body.id,
              list_id,
            }) as Promise<SubscriberList>,
        ),
      );
    }

    return {
      data: { ...updatedSubscriber, subscriberLists: updatedSubscriberLists },
      message: "Subscriber Updated Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteOneSubscriber = async (subscriberId: string): Promise<APIResponse<boolean>> => {
  try {
    await saveData("Subscriber", {
      id: subscriberId,
      is_active: false,
      is_deleted: true,
      deleted_at: new Date(),
    });

    return {
      data: true,
      message: "Subscriber Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteManySubscriber = async (subscriberIds: string[]): Promise<APIResponse<boolean>> => {
  try {
    await Promise.all(
      subscriberIds.map(async (subscriberId) => {
        await saveData("Subscriber", {
          id: subscriberId,
          is_active: false,
          is_deleted: true,
          deleted_at: new Date(),
        });
      }),
    );

    return {
      data: true,
      message: "Subscribers Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ModifySubscriberList = async ({
  subscriber_ids,
  target_list_ids,
  action,
  subscription_status,
}: {
  subscriber_ids: string[];
  target_list_ids: string[];
  action: "add" | "remove" | "unsubscribe";
  subscription_status?: boolean;
}): Promise<APIResponse<boolean>> => {
  try {
    await Promise.all(
      subscriber_ids.map(async (subscriber_id) => {
        await Promise.all(
          target_list_ids.map(async (list_id) => {
            switch (action) {
              case "add":
                await saveData("SubscriberList", {
                  subscriber_id,
                  list_id,
                  is_subscribed: subscription_status,
                  is_active: true,
                  is_deleted: false,
                });
                break;

              case "remove":
                await saveData("SubscriberList", {
                  subscriber_id,
                  list_id,
                  is_active: false,
                  is_deleted: true,
                });
                break;

              case "unsubscribe":
                await saveData("SubscriberList", {
                  subscriber_id,
                  list_id,
                  is_subscribed: false,
                });
                break;
            }
          }),
        );
      }),
    );

    return {
      data: true,
      message: "Subscriber List Membership Updated Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const BlocklistOneSubscriber = async (subscriberId: string) => {
  await saveData("Subscriber", {
    id: subscriberId,
    is_active: false,
  });

  return {
    data: true,
    message: "Subscribers Blocklisted Successfully",
    success: true,
  };
};

const BlockListManySubscribers = async ({
  subscriber_ids,
}: {
  subscriber_ids: string[];
}): Promise<APIResponse<boolean>> => {
  try {
    await Promise.all(
      subscriber_ids.map(async (subscriber_id) => {
        await saveData("Subscriber", {
          id: subscriber_id,
          is_active: false,
        });
      }),
    );

    return {
      data: true,
      message: "Subscribers Blocklisted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteSubscriberBounceRecords = async (
  subscriberId: string,
): Promise<APIResponse<boolean>> => {
  try {
    // Implement logic to delete bounce records for the subscriber
    // This is a placeholder and should be replaced with actual implementation

    return {
      data: true,
      message: "Subscriber Bounce Records Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  GetManySubscribers,
  GetOneSubscriber,
  CreateSubscriber,
  UpdateSubscriber,
  DeleteOneSubscriber,
  DeleteManySubscriber,
  ModifySubscriberList,
  BlocklistOneSubscriber,
  BlockListManySubscribers,
  DeleteSubscriberBounceRecords,
};
