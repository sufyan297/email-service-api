import { t } from "elysia";

export const ImportSubscribersDTO = t.Object({
  params: t.String({
    description: "Stringified JSON with import parameters",
    error: "Please Provide Params",
  }),
  file: t.Any({
    description: "File for upload",
    error: "Please Provide File",
  }),
});
