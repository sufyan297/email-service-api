import { t } from "elysia";

export const CreatePublicSubscriptionDTO = t.Object({
  email: t.String({
    description: "Subscriber's email address",
    error: "Please Provide Email",
  }),
  name: t.Optional(
    t.String({
      description: "Subscriber's name",
    }),
  ),
  list_uuids: t.Optional(
    t.Array(
      t.String({
        description: "List of list UUIDs",
      }),
    ),
  ),
  l: t.Optional(
    t.Union([
      t.String({
        description: "List UUID. Repeat for multiple values in form submissions",
      }),
      t.Array(
        t.String({
          description: "List UUIDs from form submissions",
        }),
      ),
    ]),
  ),
});
