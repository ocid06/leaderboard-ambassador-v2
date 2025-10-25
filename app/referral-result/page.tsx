import ReferralResultTemplate from "@/components/templates/ReferralResultTemplate";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ success?: string; reason?: string; ref?: string }>;
}

export const metadata: Metadata = {
  title: "Referral Result",
};

export default async function ReferralResultPage({ searchParams }: Props) {
  const { success, reason, ref } = await searchParams;
  return <ReferralResultTemplate success={success} reason={reason} refCode={ref} />;
}
