"use client";

interface Props {
  success?: string;
  reason?: string;
  refCode?: string;
}

export default function ReferralResultTemplate({ success, reason, refCode }: Props) {
  const isSuccess = success === "true";

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-black to-black text-white flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {isSuccess ? (
          <>
            <h1 className="text-3xl font-bold text-amber-400">
              Referral Linked Successfully 🎉
            </h1>
            <p className="text-gray-300">
              You've successfully joined under referral{" "}
              <span className="text-amber-300 font-semibold">{refCode}</span>.
            </p>
            <p className="text-gray-400 text-sm">
              Welcome to <span className="text-amber-400">CromaChain</span> Community.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-400">
              Referral Failed ❌
            </h1>
            <p className="text-gray-300 mb-1">We couldn’t complete your referral.</p>
            <p className="text-gray-400 text-sm">
              Reason: <span className="text-red-300">{reason || "unknown"}</span>
            </p>
          </>
        )}

        <div className="pt-6">
          <a
            href="/"
            className="px-6 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
          >
            Back to Home
          </a>
        </div>

        <footer className="pt-8 text-gray-500 text-xs">
          © 2025 CromaChain. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
