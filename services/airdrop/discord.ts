import { AmbassadorReferralInsert } from "@/@types/ambassador";
import { getAmbassadorByReferralCode } from "../db/ambassador";

export async function mapToDiscordReferralDb(
  discordId: string,
  referral: string,
  username: string
): Promise<AmbassadorReferralInsert> {
  const ambassador = await getAmbassadorByReferralCode(referral);
  if (!ambassador) throw new Error("Ambassador not found");
  return {
    referrer: ambassador.id,
    source: "Discord",
    source_ref_id: discordId,
    username,
  };
}
