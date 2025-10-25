export interface AmbassadorDb {
  id: string;
  name: string;
  handle: string;
  country: string;
  invites: number; // TODO : HAPUS
  score: number; // HAPUS
  created_at: string;
  updated_at: string;
  referral_code: string;
}

export interface AmbassadorReferralDb {
  id: number;
  created_at: string;
  source: string;
  source_ref_id: string;
  referrer: string;
  username: string;
}

export type AmbassadorReferralInsert = Omit<
  AmbassadorReferralDb,
  "id" | "created_at"
>;
