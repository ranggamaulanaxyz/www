import type { SupabaseClient } from "@supabase/supabase-js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { partnerListSchema, partnerSchema } from "../schemas/partner";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";

export async function getPartners(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const {from, to} = parseRange({from: options?.from, to: options?.to})
  console.log(options)
  console.log(from, to)

  const statement = supabase.from("partners").select("*", { count: "exact" });

  if (options?.query) {
    statement.or(
      `name.ilike.%${options.query}%,nickname.ilike.%${options.query}%,email.ilike.%${options.query}%,phone.ilike.%${options.query}%`,
    );
  }

  statement.order("name", {ascending: true})

  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;

  if (error) {
    throw error;
  }

  const camelcaseData = camelcaseKeys(data, { deep: true });
  const partners = await partnerListSchema.parseAsync(camelcaseData);
  return {
    partners,
    metadata: parseMetadata({count, range: {from, to}}),
  };
}

export async function createPartner(
  supabase: SupabaseClient,
  values: {
    name: string;
    nickname?: string;
    email?: string;
    phone?: string;
  },
) {
  const snakecaseValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("partners")
    .insert(snakecaseValues)
    .select();

  if (error) {
    throw error;
  }

  const camecaseData = camelcaseKeys(data);
  const partner = await partnerSchema.parseAsync(camecaseData);

  return partner;
}
