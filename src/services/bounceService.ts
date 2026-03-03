import { getCount, getMany, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Bounce from "../models/Bounce";
import { GetBounceRecordsOptions } from "../types";
import { Order, SubscriberStatus } from "../types/constants";

const GetBounceRecords = async ({
  campaign_id,
  source,
  page,
  per_page,
  order_by,
  order = Order.desc,
}: GetBounceRecordsOptions): Promise<
  APIResponse<{ results: Bounce[]; query: string; total: number; per_page: number | "all"; page: number }>
> => {
  try {
    const limit = per_page === "all" ? undefined : per_page;
    const resolvedOrder = String(order).toUpperCase() === "ASC" ? Order.asc : Order.desc;
    const resolvedPage = page || 1;
    const where = {
      ...(campaign_id && { campaign_id: campaign_id }),
      ...(source && { source: source }),
      is_deleted: false,
    };

    const bounceRecords = (await getMany("Bounce", {
      where,
      limit,
      skip: limit ? (resolvedPage - 1) * limit : undefined,
      order: order_by ? { [order_by]: resolvedOrder } : undefined,
    })) as Bounce[];
    const total = await getCount("Bounce", { where });

    return {
      data: {
        results: bounceRecords,
        query: "",
        total,
        per_page: per_page || 50,
        page: resolvedPage,
      },
      message: "Bounce records retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteOneBounceRecord = async (id: number): Promise<APIResponse<boolean>> => {
  try {
    await saveData("Bounce", {
      id: id,
      is_deleted: true,
    });

    return {
      data: true,
      message: "Bounce Record Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteManyBounceRecords = async (
  all: boolean,
  ids?: number[],
): Promise<APIResponse<boolean>> => {
  try {
    if (!all) {
      if (!ids || ids.length === 0) {
        return {
          data: true,
          message: "Bounce Record(s) Deleted Successfully",
          success: true,
        };
      }

      await Promise.all(
        ids.map(async (id) => {
          await saveData("Bounce", {
            id: id,
            is_deleted: true,
          });
        }),
      );
    } else {
      const records = (await getMany("Bounce", {
        where: {},
      })) as Bounce[];

      await Promise.all(
        records.map(async (record) => {
          await saveData("Bounce", {
            id: record.id,
            is_deleted: true,
          });
        }),
      );
    }

    return {
      data: true,
      message: "Bounce Record(s) Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GetOneBounceRecord = async (id: number): Promise<APIResponse<Bounce>> => {
  const record = (await getMany("Bounce", {
    where: { id },
    limit: 1,
  })) as Bounce[];

  return {
    data: record[0] as Bounce,
    message: "Bounce record retrieved successfully",
    success: true,
  };
};

const BlocklistBouncedSubscribers = async (): Promise<APIResponse<boolean>> => {
  const bounces = (await getMany("Bounce", {
    where: {},
    relations: { subscriber: true },
  })) as Bounce[];

  await Promise.all(
    bounces.map(async (bounce) => {
      await saveData("Subscriber", {
        id: bounce.subscriber_id,
        status: SubscriberStatus.blocklisted,
      });
    }),
  );

  return {
    data: true,
    message: "Bounced subscribers blocklisted successfully",
    success: true,
  };
};

export {
  GetBounceRecords,
  DeleteOneBounceRecord,
  DeleteManyBounceRecords,
  GetOneBounceRecord,
  BlocklistBouncedSubscribers,
};
