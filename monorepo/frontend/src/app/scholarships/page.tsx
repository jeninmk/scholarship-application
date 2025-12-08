"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the Scholarship type based on the backend fields.
export interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  donor_id?: number;
  apply_info?: string;
  is_active: boolean;
  status?: string;
  bookmark_count?: number;
  is_bookmarked: boolean;
  min_gpa?: number | string;
  allowed_major?: string;
  requires_transcript?: boolean;
  requires_recommendation?: boolean;
}

export default function ScholarshipsPage() {
  const router = useRouter();

  // State (all destructured symmetrically)
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filters
  const [amountFilter, setAmountFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [gpaFilter, setGpaFilter] = useState<string>("all");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all");

  // Unique filter options
  const allMajors: string[] = Array.from(
    new Set(
      scholarships
        .map((s) => s.allowed_major)
        .filter((m): m is string => m !== undefined)
    )
  );

  const allGPA: number[] = Array.from(
    new Set(scholarships.map((s) => Number(s.min_gpa)).filter((n) => !isNaN(n)))
  ).sort((a, b) => a - b);

  // Weeks until deadline helper
  const getWeeksUntilDeadline = (deadline: string): number => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
  };

  // Highlight “best match” if the major filter matches
  const isBestMatch = (s: Scholarship): boolean =>
    majorFilter !== "all" &&
    s.allowed_major?.toLowerCase() === majorFilter.toLowerCase();

  // Fetch scholarships
  const fetchScholarships = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:8000/api/scholarships/", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch scholarships");
      setScholarships(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  // Bookmark toggle (optimistic)
  const toggleBookmark = async (id: number) => {
    setScholarships((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_bookmarked: !s.is_bookmarked } : s
      )
    );
    const token = localStorage.getItem("authToken");
    const existing = scholarships.find((s) => s.id === id);
    const newStatus = existing ? !existing.is_bookmarked : true;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/scholarships/${id}/bookmark/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ saved: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update bookmark status");
      const updated = await res.json();
      setScholarships((prev) => prev.map((s) => (s.id === id ? updated : s)));
      await fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Error: Failed to update bookmark status");
    }
  };

  //
  // Extracted filter helpers
  //

  const matchesName = (sch: Scholarship): boolean =>
    sch.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesAmount = (sch: Scholarship): boolean => {
    if (amountFilter === "all") return true;
    if (amountFilter === "$1000+") return sch.amount >= 1000;
    if (amountFilter === "$5000+") return sch.amount >= 5000;
    if (amountFilter === "$10000+") return sch.amount >= 10000;
    return true;
  };

  const matchesMajor = (sch: Scholarship): boolean =>
    majorFilter === "all" ||
    sch.allowed_major?.toLowerCase() === majorFilter.toLowerCase();

  const matchesGpa = (sch: Scholarship): boolean =>
    gpaFilter === "all" ||
    (sch.min_gpa != null && Number(sch.min_gpa) >= parseFloat(gpaFilter));

  const matchesDeadline = (sch: Scholarship): boolean => {
    if (deadlineFilter === "all") return true;
    const w = sch.deadline ? getWeeksUntilDeadline(sch.deadline) : Infinity;
    if (deadlineFilter === "approaching-soon") return w <= 4;
    if (deadlineFilter === "4+") return w >= 4;
    if (deadlineFilter === "6+") return w >= 6;
    if (deadlineFilter === "12+") return w >= 12;
    if (deadlineFilter === "farthest-deadline") return w >= 15;
    return true;
  };

  const filtered = scholarships.filter(
    (sch) =>
      matchesName(sch) &&
      matchesAmount(sch) &&
      matchesMajor(sch) &&
      matchesGpa(sch) &&
      matchesDeadline(sch)
  );

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 bg-gradient-to-r from-[#AB0520] to-[#9B051F] flex justify-center items-center">
        <h1 className="text-2xl font-bold text-white">
          Available Scholarships
        </h1>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4">
        <input
          type="text"
          placeholder="Search scholarships by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 mb-2 md:mb-0"
        />
        <div className="flex space-x-4">
          <select
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Filter by Award Amount</option>
            <option value="$1000+">$1,000+</option>
            <option value="$5000+">$5,000+</option>
            <option value="$10000+">$10,000+</option>
          </select>
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Filter by Major</option>
            {allMajors.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={gpaFilter}
            onChange={(e) => setGpaFilter(e.target.value)}
            className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Minimum GPA</option>
            {allGPA.map((g) => (
              <option key={g} value={g.toString()}>
                {g.toFixed(1)}+
              </option>
            ))}
          </select>
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Filter by Deadline</option>
            <option value="approaching-soon">≤4 weeks</option>
            <option value="4+">4+ weeks</option>
            <option value="6+">6+ weeks</option>
            <option value="12+">12+ weeks</option>
            <option value="farthest-deadline">≥15 weeks</option>
          </select>
        </div>
      </div>

      {/* Scholarship Cards */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <div
              key={s.id}
              className={`relative bg-white rounded-lg shadow-lg p-6 flex flex-col transition ${
                s.is_bookmarked ? "bg-yellow-50" : ""
              }`}
            >
              {isBestMatch(s) && (
                <div className="absolute -top-3 -left-3 bg-yellow-500 text-white rounded-full p-1 shadow">
                  ⭐
                </div>
              )}
              <button
                className="absolute top-4 right-4 bg-white p-1 rounded-full shadow hover:bg-gray-200 z-10"
                onClick={() => toggleBookmark(s.id)}
              >
                {s.is_bookmarked ? "🔖" : "📑"}
              </button>
              <h3 className="text-2xl font-semibold text-[#1e5288] mb-2">
                {s.name}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Amount:</strong> ${s.amount.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Deadline:</strong>{" "}
                {s.deadline ? new Date(s.deadline).toLocaleDateString() : "N/A"}
              </p>
              <div className="mt-auto flex flex-col space-y-2">
                <Link
                  href={`/scholarships/${s.id}`}
                  className="block bg-[#ab0520] text-white py-2 rounded text-center hover:bg-[#8b0015] transition"
                >
                  Learn More
                </Link>
                <button
                  onClick={() => router.push(`/FillApp?scholarshipId=${s.id}`)}
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No scholarships match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
