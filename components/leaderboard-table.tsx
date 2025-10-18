"use client"

import { useState, useMemo } from "react"
import type { Ambassador } from "@/lib/mock-data"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LeaderboardTableProps {
  data: Ambassador[]
  searchQuery: string
  selectedCountry: string
  scoreRange: [number, number]
}

export function LeaderboardTable({ data, searchQuery, selectedCountry, scoreRange }: LeaderboardTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ambassador
    direction: "asc" | "desc"
  }>({ key: "rank", direction: "asc" })

  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const itemsPerPage = 20

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((amb) => {
      const matchesSearch =
        searchQuery === "" ||
        amb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amb.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amb.wallet.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === "" || amb.country === selectedCountry
      const matchesScore = amb.score >= scoreRange[0] && amb.score <= scoreRange[1]

      return matchesSearch && matchesCountry && matchesScore
    })
  }, [data, searchQuery, selectedCountry, scoreRange])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    return sorted
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIdx, startIdx + itemsPerPage)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (key: keyof Ambassador) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
    setCurrentPage(1)
  }

  const toggleRowExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const exportToCSV = () => {
    const headers = ["Rank", "Name", "Handle", "Wallet", "Country", "Invites", "Bonus Multiplier", "Score"]

    const rows = paginatedData.map((amb) => [
      amb.rank,
      amb.name,
      amb.handle,
      amb.wallet,
      amb.country,
      amb.invites,
      amb.bonus_multiplier,
      amb.score,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cromaart-leaderboard.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const SortIcon = ({ column }: { column: keyof Ambassador }) => {
    if (sortConfig.key !== column) return <div className="w-4 h-4" />
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/20 bg-black/60">
              <th className="px-4 py-3 text-left font-semibold text-amber-400">
                <button
                  onClick={() => handleSort("rank")}
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  Rank
                  <SortIcon column="rank" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-amber-400">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  Name
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-amber-400">Handle</th>
              <th className="px-4 py-3 text-left font-semibold text-amber-400">Country</th>
              <th className="px-4 py-3 text-right font-semibold text-amber-400">
                <button
                  onClick={() => handleSort("invites")}
                  className="flex items-center justify-end gap-2 hover:text-amber-300 transition-colors w-full"
                >
                  Invites
                  <SortIcon column="invites" />
                </button>
              </th>
              <th className="px-4 py-3 text-right font-semibold text-amber-400">
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center justify-end gap-2 hover:text-amber-300 transition-colors w-full"
                >
                  Score
                  <SortIcon column="score" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((amb, idx) => {
              const isTopThree = amb.rank <= 3
              return (
                <tr
                  key={amb.id}
                  className={`border-b border-amber-500/10 hover:bg-amber-500/5 transition-colors ${
                    isTopThree ? "ring-1 ring-amber-500/30 bg-amber-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-amber-400">{amb.rank}</td>
                  <td className="px-4 py-3 text-white">{amb.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{amb.handle}</td>
                  <td className="px-4 py-3 text-gray-400">{amb.country}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{amb.invites}</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-300">{amb.score.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((amb) => {
          const isTopThree = amb.rank <= 3
          const isExpanded = expandedRows.has(amb.id)
          return (
            <div
              key={amb.id}
              className={`rounded-lg border border-amber-500/20 backdrop-blur-md bg-black/40 overflow-hidden transition-all ${
                isTopThree ? "ring-1 ring-amber-500/30 bg-amber-500/5" : ""
              }`}
            >
              <button
                onClick={() => toggleRowExpanded(amb.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-500/5 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <span className="font-semibold text-amber-400 w-8">#{amb.rank}</span>
                  <div>
                    <div className="font-semibold text-white">{amb.name}</div>
                    <div className="text-xs text-gray-400">{amb.handle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-amber-300">{amb.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 py-3 border-t border-amber-500/10 bg-black/60 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white">{amb.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Invites:</span>
                    <span className="text-white">{amb.invites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Multiplier:</span>
                    <span className="text-white">{amb.bonus_multiplier}x</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-500/10">
                    <span className="text-gray-400 font-mono text-xs">{amb.wallet}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination and Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-gray-400">
          Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    currentPage === pageNum
                      ? "bg-amber-500/30 text-amber-300 font-semibold"
                      : "text-gray-400 hover:text-amber-400"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && <span className="text-gray-400 px-2">...</span>}
          </div>

          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
          >
            Next
          </Button>
        </div>

        <Button
          onClick={exportToCSV}
          size="sm"
          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
