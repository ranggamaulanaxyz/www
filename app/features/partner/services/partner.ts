import type { SupabaseClient } from "@supabase/supabase-js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { partnerListSchema, partnerSchema } from "../schemas/partner";
import { sleep } from "~/utils/tools";
import type { FilterOptions } from "~/features/desk/types/filter";
import { getPaginationRange, paginate } from "~/utils/supabase.paginate";

export async function getPartners(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const range = getPaginationRange(options?.page, options?.pageSize);
  const statement = supabase
    .from("partners")
    .select("*")
    .range(range.from, range.to);
  const { data, count, page, pageSize, totalPages, error } = await paginate(
    statement,
    {
      page: options?.page,
      pageSize: options?.pageSize,
    },
  );

  if (error) {
    throw error;
  }

  const camelcaseData = camelcaseKeys(data, { deep: true });
  const partners = await partnerListSchema.parseAsync(camelcaseData);
  return {
    partners,
    count,
    page,
    pageSize,
    totalPages,
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
