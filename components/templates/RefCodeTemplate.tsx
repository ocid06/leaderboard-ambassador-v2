"use client";

import { AmbassadorDb } from "@/@types/ambassador";

interface Props {
  ambassador: AmbassadorDb | null;
}

export default function RefCodeTemplates({ ambassador }: Props) {
  //   const DISCORD_URL =
  //     "https://discord.com/oauth2/authorize?client_id=1401376092840923246&redirect_uri=https%3A%2F%2Fairdrop.cromachain.com%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds.join";
  const DISCORD_URL =
    `https://discord.com/oauth2/authorize?client_id=1401376092840923246&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds.join&state=cromaart-referral:${ambassador?.referral_code}`;

  const TELEGRAM_URL = "https://t.me/your-telegram-channel"; // ganti dengan link kamu

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-black to-black text-white flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-amber-400">CROMACHAIN</span> REFERRAL
          </h1>
          <p className="text-gray-400 mt-2">Confirm your ambassador identity</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-amber-500/20 bg-black/70 backdrop-blur-md p-6 space-y-4">
          {ambassador ? (
            <>
              <div>
                <div className="text-gray-400 text-sm mb-1">
                  Ambassador Name
                </div>
                <div className="text-2xl font-semibold text-amber-400">
                  {ambassador.name}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Handle</div>
                <div className="text-lg">{ambassador.handle}</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Country</div>
                <div className="text-lg">{ambassador.country}</div>
              </div>

              <div className="border-t border-amber-500/10 my-4"></div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Referral Code</div>
                <div className="text-lg font-mono bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 text-amber-300">
                  {ambassador.referral_code}
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 rounded-lg bg-[#5865F2] text-white font-semibold hover:bg-[#4752C4] transition"
                >
                  Join Discord Community
                </a>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 rounded-lg bg-[#0088cc] text-white font-semibold hover:bg-[#007ab8] transition"
                >
                  Join Telegram Channel
                </a>
              </div>
            </>
          ) : (
            <div className="text-red-400 font-medium">
              Referral code not found or invalid.
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm">
          © 2025 CromaChain. All rights reserved.
        </p>
      </div>
    </main>
  );
}
