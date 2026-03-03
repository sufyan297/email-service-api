import type { AppInstance } from "../../index";
import { SendTransactionalDTO } from "../dto/transactional";
import AdminAuth from "../middleware/admin_auth";
import { SendTransactionalMessage } from "../services/transactionalService";

export const TransactionalController = (app: AppInstance) => {
  app.post(
    "/api/tx",
    async ({ body }) => {
      return await SendTransactionalMessage(body);
    },
    {
      detail: { tags: ["Transactional"], description: "Send transactional messages" },
      beforeHandle: AdminAuth,
      body: SendTransactionalDTO,
    },
  );
};
