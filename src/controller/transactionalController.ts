import type { AppInstance } from "../../index";
import { SendTransactionalDTO } from "../dto/transactional";

export const TransactionalController = (app: AppInstance) => {
  app.post("/tx", async () => {}, {
    detail: { tags: ["Transactional"], description: "Send transactional messages" },
    body: SendTransactionalDTO,
  });
};
