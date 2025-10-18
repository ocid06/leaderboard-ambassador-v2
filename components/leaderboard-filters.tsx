"use client"

import { useState, useMemo } from "react"
import type { Ambassador } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeaderboardFiltersProps {
  data: Ambassador[]
  onSearchChange: (query: string) => void
  onCountryChange: (country: string) => void
  onScoreRangeChange: (range: [number, number]) => void
}

export function LeaderboardFilters({
  data,
  onSearchChange,
  onCountryChange,
  onScoreRangeChange,
}: LeaderboardFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [minScore, setMinScore] = useState("0")
  const [maxScore, setMaxScore] = useState("10000")

  const countries = useMemo(() => {
    const unique = Array.from(new Set(data.map((amb) => amb.country))).sort()
    return unique
  }, [data])

  const maxScoreInData = useMemo(() => {
    return Math.max(...data.map((amb) => amb.score))
  }, [data])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    onCountryChange(value)
  }

  const handleMinScoreChange = (value: string) => {
    const num = Number.parseInt(value) || 0
    setMinScore(value)
    onScoreRangeChange([num, Number.parseInt(maxScore) || maxScoreInData])
  }

  const handleMaxScoreChange = (value: string) => {
    const num = Number.parseInt(value) || maxScoreInData
    setMaxScore(value)
    onScoreRangeChange([Number.parseInt(minScore) || 0, num])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
        <Input
          placeholder="Search by name, handle, or wallet..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="bg-black/40 border-amber-500/20 text-white placeholder:text-gray-500 focus:border-amber-500/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="bg-black/40 border-amber-500/20 text-white">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-amber-500/20">
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Score Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minScore}
              onChange={(e) => handleMinScoreChange(e.target.value)}
              className="bg-black/40 border-amber-500/20 text-white placeholder:text-gray-500 focus:border-amber-500/50"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxScore}
              onChange={(e) => handleMaxScoreChange(e.target.value)}
              className="bg-black/40 border-amber-500/20 text-white placeholder:text-gray-500 focus:border-amber-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
