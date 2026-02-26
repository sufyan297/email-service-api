import { GetManyListsOptions } from "typeorm";
import { AppError } from "../../libs/Errors";
import { getCount, getMany, getOne, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import List from "../models/List";

const GetManyLists = async ({
  query,
  is_active = true,
  page,
  per_page,
  order_by,
  order = "DESC",
}: GetManyListsOptions): Promise<APIResponse<List[]>> => {
  try {
    const lists = (await getMany("List", {
      where: {
        ...(query && { "name LIKE": `%${query}%` }),
        is_active,
        is_deleted: false,
      },
      limit: per_page,
      skip: page && per_page ? (page - 1) * per_page : undefined,
      order: order_by ? { [order_by]: order } : undefined,
    })) as List[];

    return {
      data: lists,
      message: "Subscribers retrieved successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const GetOneList = async (listId: string): Promise<APIResponse<List>> => {
  try {
    const list = (await getOne("List", {
      where: {
        id: listId,
        is_active: true,
        is_deleted: false,
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
      id: body.id,
      ...body,
    })) as List;

    return {
      data: updatedList,
      message: "List Updated Successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeleteOneList = async (listId: string): Promise<APIResponse<boolean>> => {
  try {
    await saveData("List", {
      id: listId,
      is_active: false,
      is_deleted: true,
      deleted_at: new Date(),
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

const DeleteManyLists = async (listIds: string[]): Promise<APIResponse<boolean>> => {
  try {
    await Promise.all(
      listIds.map(async (listId) => {
        await saveData("List", {
          id: listId,
          is_active: false,
          is_deleted: true,
          deleted_at: new Date(),
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
