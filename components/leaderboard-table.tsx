"use client";

import { useMemo, useState } from "react";

type Ambassador = {
  id: string;
  name: string;
  handle: string;
  country: string;
  invites: number;
  score: number;
};

type Props = {
  data: Ambassador[];
  searchQuery: string;
  selectedCountry: string;
  scoreRange: [number, number];
};

// formatter angka konsisten
const nfInt = new Intl.NumberFormat("en-US");

export function LeaderboardTable({
  data,
  searchQuery,
  selectedCountry,
  scoreRange,
}: Props) {
  // ====== Filter + Sort ======
  const visible = useMemo(() => {
    const [minScore, maxScore] = scoreRange;

    let rows = data.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.handle.toLowerCase().includes(q);
      const matchCountry = !selectedCountry || r.country === selectedCountry;
      const matchScore = r.score >= minScore && r.score <= maxScore;
      return matchSearch && matchCountry && matchScore;
    });

    // urutkan: score desc, lalu invites desc
    rows = rows
      .slice()
      .sort(
        (a, b) =>
          (b.score ?? 0) - (a.score ?? 0) ||
          (b.invites ?? 0) - (a.invites ?? 0)
      );

    return rows;
  }, [data, searchQuery, selectedCountry, scoreRange]);

  // ====== Pagination ======
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const total = visible.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) setPage(1);

  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pageRows = visible.slice(startIdx, endIdx);

  // ====== Export CSV (rows halaman saat ini) ======
  function exportCSV() {
    const header = ["Rank", "Name", "Handle", "Country", "Invites", "Score"];
    const body = pageRows.map((row, i) => [
      String(startIdx + i + 1),
      row.name,
      row.handle,
      row.country,
      String(row.invites),
      Number(row.score || 0).toFixed(3),
    ]);

    const csv =
      [header, ...body]
        .map((r) =>
          r
            .map((field) => {
              const s = String(field ?? "");
              if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
              return s;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaderboard_page_${page}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function PageButton({
    n,
    active,
    onClick,
  }: {
    n: number;
    active?: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className={`px-2.5 py-1 rounded ${
          active
            ? "bg-amber-500 text-black"
            : "text-amber-400 hover:bg-amber-500/10"
        }`}
      >
        {n}
      </button>
    );
  }

  function renderPageNumbers() {
    const items: JSX.Element[] = [];
    const windowSize = 5;
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + windowSize - 1);

    for (let n = start; n <= end; n++) {
      items.push(
        <PageButton key={n} n={n} active={n === page} onClick={() => setPage(n)} />
      );
    }

    if (end < totalPages) {
      items.push(
        <span key="dots" className="px-2 text-amber-400">
          …
        </span>
      );
      items.push(
        <PageButton
          key={totalPages}
          n={totalPages}
          active={page === totalPages}
          onClick={() => setPage(totalPages)}
        />
      );
    }

    return items;
  }

  return (
    <div className="rounded-xl border border-amber-500/20 backdrop-blur-md bg-black/60 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-black/40">
          <tr className="text-amber-400 text-sm">
            <th className="px-6 py-4 text-left">Rank</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Handle</th>
            <th className="px-6 py-4 text-left">Country</th>
            <th className="px-6 py-4 text-right">Invites</th>
            <th className="px-6 py-4 text-right">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-500/10">
          {pageRows.map((row, idx) => (
            <tr key={row.id} className="text-gray-200">
              {/* Rank global (ikut filter & sort) */}
              <td className="px-6 py-4">{startIdx + idx + 1}</td>

              <td className="px-6 py-4">{row.name}</td>
              <td className="px-6 py-4 text-gray-400">{row.handle}</td>
              <td className="px-6 py-4">{row.country}</td>

              <td className="px-6 py-4 text-right">
                {nfInt.format(Number(row.invites || 0))}
              </td>

              <td className="px-6 py-4 text-right">
                {Number(row.score || 0).toFixed(3)}
              </td>
            </tr>
          ))}

          {pageRows.length === 0 && (
            <tr>
              <td className="px-6 py-10 text-center text-gray-400" colSpan={6}>
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer pagination + export */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-amber-500/10">
        <div className="text-sm text-gray-400">
          Showing{" "}
          <span className="text-amber-400">{total === 0 ? 0 : startIdx + 1}</span>{" "}
          to{" "}
          <span className="text-amber-400">{endIdx}</span> of{" "}
          <span className="text-amber-400">{total}</span> results
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded text-amber-400 hover:bg-amber-500/10 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">{renderPageNumbers()}</div>

          <button
            className="px-3 py-1 rounded text-amber-400 hover:bg-amber-500/10 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>

          <button
            onClick={exportCSV}
            className="ml-4 px-3 py-1 rounded bg-amber-500 text-black hover:brightness-110"
            title="Export current page to CSV"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
