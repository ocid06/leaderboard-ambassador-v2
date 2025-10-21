"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LeaderboardFilters } from "@/components/leaderboard-filters";
import { LeaderboardTable } from "@/components/leaderboard-table";
import type { Ambassador } from "@/lib/mock-data";

// formatter angka konsisten (hindari hydration error)
const nf = new Intl.NumberFormat("en-US");

// Supabase client (public)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Use shared Ambassador type from lib/mock-data

export default function Home() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error("Supabase env is missing. Check NEXT_PUBLIC_SUPABASE_*");
        }

        const { data, error } = await supabase
          .from("Ambassador") // nama tabel persis (A besar)
          .select("*")
          .order("score", { ascending: false })
          .order("invites", { ascending: false });

        if (error) throw error;

        const rows = (data ?? []).map((d: any) => ({
          id: String(d.id),
          name: String(d.name ?? ""),
          handle: String(d.handle ?? ""),
          country: String(d.country ?? ""),
          invites: Number(d.invites ?? 0),
          score: Number(d.score ?? 0),
          // mock-data.Ambassador requires these fields: provide safe defaults
          rank: typeof d.rank === "number" ? d.rank : 0,
          wallet: String(d.wallet ?? ""),
          bonus_multiplier: Number(d.bonus_multiplier ?? 1),
        })) as Ambassador[];

        setAmbassadors(rows);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load");
        setAmbassadors([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    if (!ambassadors.length) return { totalInvites: 0, avgScore: 0 };
    const totalInvites = ambassadors.reduce((sum, amb) => sum + (amb.invites || 0), 0);
    const avgScore = Math.round(
      ambassadors.reduce((sum, amb) => sum + (amb.score || 0), 0) / ambassadors.length
    );
    return { totalInvites, avgScore };
  }, [ambassadors]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-black to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-black/40 border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  <span className="text-amber-400">CROMACHAIN</span> LEADERBOARD
                </h1>
                <p className="text-gray-400 mt-1">Ambassador Rankings & Performance</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/70 p-6">
              <div className="text-sm font-medium text-gray-400 mb-2">Total Ambassadors</div>
              <div className="text-3xl font-bold text-amber-400">{ambassadors.length}</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/70 p-6">
              <div className="text-sm font-medium text-gray-400 mb-2">Total Invites</div>
              <div className="text-3xl font-bold text-amber-400">{nf.format(stats.totalInvites)}</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/70 p-6">
              <div className="text-sm font-medium text-gray-400 mb-2">Average Score</div>
              <div className="text-3xl font-bold text-amber-400">{nf.format(stats.avgScore)}</div>
            </div>
          </div>
        </section>

        {/* Loading / Error */}
        {loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-gray-400">Loading leaderboard…</div>
          </div>
        )}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-red-400">Error: {error}</div>
          </div>
        )}

        {/* Filters and Table */}
        {!loading && !error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <LeaderboardFilters
              data={ambassadors}
              onSearchChange={setSearchQuery}
              onCountryChange={setSelectedCountry}
              onScoreRangeChange={setScoreRange}
            />
            <LeaderboardTable
              data={ambassadors}
              searchQuery={searchQuery}
              selectedCountry={selectedCountry}
              scoreRange={scoreRange}
            />
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-amber-500/20 backdrop-blur-md bg-black/40 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-400 text-sm">
              <p>© 2025 CromaArt. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
