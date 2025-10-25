import { AmbassadorReferralInsert } from "@/@types/ambassador";
import { supabaseAdmin } from "@/config/supabase";

const tableName = "ambassador_referrals";

export async function getAmbassadorReferralBySourceAndRefId(
  source_ref_id: string,
  source: string
): Promise<AmbassadorReferralInsert | null> {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .eq("source_ref_id", source_ref_id)
    .eq("source", source)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function createNewAmbassadorReferral(
  payload: AmbassadorReferralInsert
) {
  const { error } = await supabaseAdmin.from(tableName).insert(payload);
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function createNewAmbassadorReferralifNoExist(
  payload: AmbassadorReferralInsert
) {
  const exist = await getAmbassadorReferralBySourceAndRefId(
    payload.source_ref_id,
    payload.source
  );
  if (exist) throw new Error("This referral is exist!");
  await createNewAmbassadorReferral(payload);
}
