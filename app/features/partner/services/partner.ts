import type { SupabaseClient } from "@supabase/supabase-js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { partnerListSchema, partnerSchema } from "../schemas/partner";
import { sleep } from "~/utils/tools";
import type { FilterOptions } from "~/features/desk/types/filter";
import { getPaginationRange, paginate } from "~/utils/supabase.paginate";

function getRangeSize(from: number, to: number): number {
  return to - (from - 1);
}

export async function getPartners(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  let from = 1;
  let to = 84;
  let size = getRangeSize(from, to);
  if (options?.from && options.from > 0) {
    from = options.from;
  }

  if (options?.to && options.to >= from) {
    to = options.to;
  }

  if (from > to) {
    to = from + size - 1;
  }

  size = getRangeSize(from, to);

  console.log({ from, to, size });

  const statement = supabase.from("partners").select("*", { count: "exact" });

  if (options?.query) {
    statement.or(
      `name.ilike.%${options.query}%,nickname.ilike.%${options.query}%,email.ilike.%${options.query}%,phone.ilike.%${options.query}%`,
    );
  }

  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;

  if (error) {
    throw error;
  }

  const camelcaseData = camelcaseKeys(data, { deep: true });
  const partners = await partnerListSchema.parseAsync(camelcaseData);
  return {
    partners,
    count,
    filterData: {
      query: options?.query,
      from,
      to,
      size,
    },
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
