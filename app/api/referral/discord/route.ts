import { mapToDiscordReferralDb } from "@/services/airdrop/discord";
import { createNewAmbassadorReferralifNoExist } from "@/services/db/ambassador_referrals";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const discordId = searchParams.get("discord-id");
    const username = searchParams.get("username");
    const referralCode = searchParams.get("referral-code");

    // ✅ Validasi data dasar
    if (!discordId || !username || !referralCode) {
      return NextResponse.redirect(
        new URL(
          `/referral-result?success=false&reason=invalid-data`,
          process.env.NEXT_PUBLIC_BASE_URL || req.url
        )
      );
    }

    // ✅ Mapping dan insert data
    const payload = await mapToDiscordReferralDb(
      discordId,
      referralCode,
      username
    );

    await createNewAmbassadorReferralifNoExist(payload);

    // ✅ Redirect ke halaman sukses
    return NextResponse.redirect(
      new URL(
        `/referral-result?success=true&ref=${referralCode}`,
        process.env.NEXT_PUBLIC_BASE_URL || req.url
      )
    );
  } catch (error: any) {
    console.error("Referral creation failed:", error.message);

    let reason = "unknown";
    if (error.message.includes("Ambassador not found"))
      reason = "ambassador-not-found";
    else if (error.message.includes("exist"))
      reason = "already-exist";
    else reason = "server-error";

    // ❌ Redirect ke halaman gagal
    return NextResponse.redirect(
      new URL(
        `/referral-result?success=false&reason=${reason}`,
        process.env.NEXT_PUBLIC_BASE_URL || req.url
      )
    );
  }
}
