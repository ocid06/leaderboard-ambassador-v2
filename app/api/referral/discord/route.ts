import { getDiscordUserInfo } from "@/services/airdrop/discord";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const discordId = searchParams.get("discord-id");
  const username = searchParams.get("username");
  const referralCode = searchParams.get("referral-code");

  return NextResponse.json({ discordId, username, referralCode });
}
