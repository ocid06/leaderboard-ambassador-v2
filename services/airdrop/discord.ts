import { api } from "@/config/api";
import axios from "axios";

export async function getDiscordUserInfo() {
  try {
    const { data } = await api.get("/api/discord/callback");

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
