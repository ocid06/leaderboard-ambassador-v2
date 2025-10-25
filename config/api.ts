import axios from "axios";
export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_API_BASE_URL
      : process.env.PROD_API_BASE_URL,
  headers: {
    "x-airdrop-key": process.env.AIRDROP_SHARED_SECRET_KEY,
  },
});
