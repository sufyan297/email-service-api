import { t } from "elysia";

export const CreatePublicSubscriptionDTO = t.Object({
  email: t.String({
    description: "Subscriber's email address",
    error: "Please Provide Email",
  }),
  name: t.String({
    description: "Subscriber's name",
    optional: true,
  }),
  list_uuids: t.Array(
    t.String({
      description: "List of list UUIDs",
      error: "Please Provide List UUIDs",
    }),
  ),
});
