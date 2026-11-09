import camelcaseKeys from "camelcase-keys";
import type { Route } from "./+types/webhook";
import { updateSchema } from "../schemas/update.schemas";

export async function action({ request }: Route.ActionArgs) {
  const requestData = (await request.json()) as never;
  const camelCasedRequestData = camelcaseKeys(requestData, { deep: true });
  const updateData = updateSchema.parse(camelCasedRequestData);
  console.log(updateData);
  return updateData;
}
