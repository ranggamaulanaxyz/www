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
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase.from("partners").select("*", { count: "exact" });

  if (options?.query) {
    statement.or(
      `name.ilike.%${options.query}%,nickname.ilike.%${options.query}%,email.ilike.%${options.query}%,phone.ilike.%${options.query}%`,
    );
  }

  statement.order("name", { ascending: true });

  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;

  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const partners = await partnerListSchema.parseAsync(camelcasedData);
  return {
    partners,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getPartnerById(supabase: SupabaseClient, id: string) {
  const statement = supabase.from("partners").select("*").eq("id", id).single();
  const { data, error } = await statement;
  if (error) {
    throw error;
  }

  const camelCasedData = camelcaseKeys(data);
  const partner = await partnerSchema.parseAsync(camelCasedData);
  return partner;
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

export async function updatePartner(
  supabase: SupabaseClient,
  id: string,
  values: {
    name: string;
    nickname?: string | null;
    email?: string | null;
    phone?: string | null;
  },
) {
  const { error } = await supabase.from("partners").update(values).eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}

export async function getPartnerSummary(supabase: SupabaseClient) {
  const { data, count, error } = await supabase
    .from("partners")
    .select("*", { count: "estimated" })
    .range(0, 4);

  if (error) {
    throw error;
  }

  const camelCasedData = camelcaseKeys(data);
  const partners = await partnerListSchema.parseAsync(camelCasedData);

  return {
    partners,
    count,
  };
}
