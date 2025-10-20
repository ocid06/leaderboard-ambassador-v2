"use client";

import { useState, useMemo } from "react";
import type { Ambassador } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardFiltersProps {
  data: Ambassador[];
  onSearchChange: (query: string) => void;
  onCountryChange: (country: string) => void;     // kirim value lowercase/trim
  onScoreRangeChange: (range: [number, number]) => void;
}

// helper: ubah ke Title Case untuk label
function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function LeaderboardFilters({
  data,
  onSearchChange,
  onCountryChange,
  onScoreRangeChange,
}: LeaderboardFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [minScore, setMinScore] = useState<string>("0");
  const [maxScore, setMaxScore] = useState<string>("100000");

  // ====== Countries unik & bersih ======
  // value: lowercase+trim (untuk filter)
  // label: Title Case (untuk tampilan)
  const countries = useMemo(() => {
    const map = new Map<string, string>(); // key = value(lowercase), val = label(Title Case)

    for (const amb of data ?? []) {
      const raw = (amb.country ?? "").trim();
      if (!raw) continue;
      const key = raw.toLowerCase(); // normalisasi
      if (!map.has(key)) {
        map.set(key, toTitleCase(raw));
      }
    }

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const maxScoreInData = useMemo(() => {
    const scores = (data ?? [])
      .map((amb) => amb.score)
      .filter((n): n is number => typeof n === "number" && !Number.isNaN(n));
    return scores.length ? Math.max(...scores) : 0;
  }, [data]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCountryChange = (value: string) => {
    // value sudah lowercase & trimmed
    setSelectedCountry(value);
    onCountryChange(value);
  };

  const handleMinScoreChange = (value: string) => {
    setMinScore(value);
    const minNum = value === "" ? 0 : Number.parseInt(value) || 0;
    const maxNum =
      maxScore === "" ? maxScoreInData : Number.parseInt(maxScore) || maxScoreInData;
    onScoreRangeChange([minNum, maxNum]);
  };

  const handleMaxScoreChange = (value: string) => {
    setMaxScore(value);
    const maxNum =
      value === "" ? maxScoreInData : Number.parseInt(value) || maxScoreInData;
    const minNum = minScore === "" ? 0 : Number.parseInt(minScore) || 0;
    onScoreRangeChange([minNum, maxNum]);
  };

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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="bg-black/40 border-amber-500/20 text-white">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-amber-500/20">
              {/* nilai 'all' untuk menampilkan semua */}
              <SelectItem value="all">All countries</SelectItem>

              {/* negara unik & rapi */}
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Score Range
          </label>
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
  );
}
