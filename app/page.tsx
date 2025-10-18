"use client"

import { useState, useMemo } from "react"
import { generateMockAmbassadors } from "@/lib/mock-data"
import { LeaderboardFilters } from "@/components/leaderboard-filters"
import { LeaderboardTable } from "@/components/leaderboard-table"

export default function Home() {
  const ambassadors = useMemo(() => generateMockAmbassadors(), [])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10000])

  const stats = useMemo(() => {
    const totalInvites = ambassadors.reduce((sum, amb) => sum + amb.invites, 0)
    const avgScore = Math.round(ambassadors.reduce((sum, amb) => sum + amb.score, 0) / ambassadors.length)

    return { totalInvites, avgScore }
  }, [ambassadors])

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
              <div className="text-3xl font-bold text-amber-400">{stats.totalInvites.toLocaleString()}</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/70 p-6">
              <div className="text-sm font-medium text-gray-400 mb-2">Average Score</div>
              <div className="text-3xl font-bold text-amber-400">{stats.avgScore.toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* Filters and Table */}
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
  )
}
