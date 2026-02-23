import { AppError } from "../../libs/Errors";
import { getCount, saveData } from "../../libs/Query";
import { APIResponse } from "../GlobalResponseHandler";
import Subscriber from "../models/Subcriber";

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
    throw error;
  }
};

export { CreateSubscriber };
