import RefCodeTemplates from "@/components/templates/RefCodeTemplate";
import { getAmbassadorByReferralCode } from "@/services/db/ambassador";
import { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

export const metadata: Metadata = {
  title: "Referral Code",
};

export default async function RefCodePage({ params }: Props) {
  const { code } = await params;

  const ambassador = await getAmbassadorByReferralCode(code);
  return <RefCodeTemplates ambassador={ambassador} />;
}
