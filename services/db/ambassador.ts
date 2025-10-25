import { AmbassadorDb } from "@/@types/ambassador";
import { supabaseAdmin } from "@/config/supabase";

export async function getAllAmbassador():Promise<AmbassadorDb[]> {
  const { data, error } = await supabaseAdmin.from("ambassador").select("*");
  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
