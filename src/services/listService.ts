import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, rawQuery, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import List from "../models/List";
import { GetManyListsOptions } from "../types";
import { Order } from "../types/constants";

const GetManyLists = async ({
  query,
  type,
  optin,
  status,
  minimal,
  tag,
  tags,
  page = 1,
  per_page = 50,
  order_by = "created_at",
  order = Order.desc,
}: GetManyListsOptions): Promise<
  APIResponse<{ results: List[]; total: number; per_page: number | "all"; page: number }>
> => {
  try {
    const limit = per_page === "all" ? undefined : per_page;
    const tagFilters = [...(Array.isArray(tags) ? tags : []), ...(Array.isArray(tag) ? tag : tag ? [tag] : [])];
    const where = {
      ...(query && { "name LIKE": `%${query}%` }),
      ...(type && { type: type }),
      ...(optin && { optin: optin }),
      ...(status && { status: status }),
      ...(tagFilters.length > 0 && { "tags LIKE": `%"${tagFilters[0]}"%` }),
    };

    const lists = (await getMany("List", {
      where,
      ...(minimal && { select: { subscriber_count: false } }),
      limit,
      skip: limit ? (page - 1) * limit : undefined,
      order: { [order_by]: order },
    })) as List[];
    const total = await getCount("List", { where });

    return {
      data: {
        results: lists,
        total,
        per_page,
        page,
      },
      message: "Lists retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GetOneList = async (listId: number): Promise<APIResponse<List>> => {
  try {
    const list = (await getOne("List", {
      where: {
        id: listId,
      },
      relations: { subscriberLists: true },
    })) as List;

    return {
      data: list,
      message: "List retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CreateList = async (body: Partial<List>): Promise<APIResponse<List>> => {
  try {
    const existingList = await getCount("List", {
      where: {
        name: body.name,
      },
    });

    if (existingList > 0) throw new AppError("List Already Exists", 409);

    const newList = (await saveData<List>("List", {
      ...body,
    })) as List;

    return {
      data: newList,
      message: "List Created Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const UpdateList = async (body: Partial<List>): Promise<APIResponse<List>> => {
  try {
    const updatedList = (await saveData("List", {
      ...body,
    })) as List;

    const list = (await getOne("List", {
      where: { id: updatedList.id },
      relations: { subscriberLists: true },
    })) as List;

    return {
      data: list,
      message: "List Updated Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteOneList = async (listId: number): Promise<APIResponse<boolean>> => {
  try {
    await saveData("List", {
      id: listId,
      is_deleted: true,
    });

    return {
      data: true,
      message: "List Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteManyLists = async ({
  ids,
  query,
}: {
  ids?: number[];
  query?: string;
}): Promise<APIResponse<boolean>> => {
  try {
    let listIds = (ids || []).map((id) => Number(id)).filter((id) => Number.isFinite(id));

    if (listIds.length === 0 && query) {
      const escapedQuery = query.replaceAll("'", "''");
      const rows = (await rawQuery(
        `SELECT id FROM lists WHERE is_deleted = false AND name LIKE '%${escapedQuery}%'`,
      )) as Array<{ id: number | string }>;
      listIds = rows.map((row) => Number(row.id)).filter((id) => Number.isFinite(id));
    }

    if (listIds.length === 0) {
      return {
        data: true,
        message: "Lists Deleted Successfully",
        success: true,
      };
    }

    await Promise.all(
      listIds.map(async (listId) => {
        await saveData("List", {
          id: listId,
          is_deleted: true,
        });
      }),
    );

    return {
      data: true,
      message: "Lists Deleted Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { GetManyLists, GetOneList, CreateList, UpdateList, DeleteOneList, DeleteManyLists };
