"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the Scholarship type based on your backend fields.
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

// Define a minimal type for Applications. Adjust as needed.
interface Application {
  id: number;
  scholarship: number;
  data: any;
  submitted_at: string;
}

export default function MatchedApplicationsPage() {
  const router = useRouter();

  // State hooks (all destructured symmetrically)
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [amountFilter, setAmountFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [gpaFilter, setGpaFilter] = useState<string>("all");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all");

  const [userEligibility, setUserEligibility] = useState<{
    id: number;
    major: string;
    gpa: number;
  }>({ id: 0, major: "", gpa: 0 });

  // Fetch current user details
  const fetchUserEligibility = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUserLoading(false);
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();
      setUserEligibility({
        id: data.id ?? 0,
        major: data.major ?? "",
        gpa: Number(data.gpa) || 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fetch all scholarships
  const fetchScholarships = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scholarships/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
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

  // Fetch current user's applications
  const fetchUserApplications = useCallback(async (userId: number) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/applications/applications/?applicant=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch applications");
      setApplications(await res.json());
    } catch {
      // swallow errors
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUserEligibility();
    fetchScholarships();
  }, [fetchUserEligibility, fetchScholarships]);

  // Once we know user ID, load their applications
  useEffect(() => {
    if (userEligibility.id) {
      fetchUserApplications(userEligibility.id);
    }
  }, [userEligibility.id, fetchUserApplications]);

  // Unique filter options (no unnecessary assertion)
  const allMajors = Array.from(
    new Set(scholarships.map((s) => s.allowed_major).filter(Boolean))
  );

  const allGPA = Array.from(
    new Set(scholarships.map((s) => Number(s.min_gpa)).filter((g) => !isNaN(g)))
  ).sort((a, b) => a - b);

  // Weeks until deadline helper
  const weeksUntil = (deadline: string) =>
    Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
    );

  // Filter out ineligible or already-applied scholarships
  const eligible = scholarships.filter((s) => {
    const majorOK =
      !s.allowed_major ||
      s.allowed_major.toLowerCase() === userEligibility.major.toLowerCase();
    const gpaOK = s.min_gpa == null || userEligibility.gpa >= Number(s.min_gpa);
    return majorOK && gpaOK;
  });
  const appliedIds = new Set(applications.map((a) => a.scholarship));
  const available = eligible.filter((s) => !appliedIds.has(s.id));

  // Extracted small helpers to reduce cognitive complexity
  const matchesSearch = (s: Scholarship) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesAmount = (s: Scholarship) => {
    switch (amountFilter) {
      case "$1000+":
        return s.amount >= 1000;
      case "$5000+":
        return s.amount >= 5000;
      case "$10000+":
        return s.amount >= 10000;
      default:
        return true;
    }
  };

  const matchesMajor = (s: Scholarship) =>
    majorFilter === "all" ||
    s.allowed_major?.toLowerCase() === majorFilter.toLowerCase();

  const matchesGPA = (s: Scholarship) =>
    gpaFilter === "all" ||
    (s.min_gpa != null && Number(s.min_gpa) >= parseFloat(gpaFilter));

  const matchesDeadline = (s: Scholarship) => {
    if (deadlineFilter === "all") return true;
    const w = s.deadline ? weeksUntil(s.deadline) : Infinity;
    switch (deadlineFilter) {
      case "approaching-soon":
        return w <= 4;
      case "4+":
        return w >= 4;
      case "6+":
        return w >= 6;
      case "12+":
        return w >= 12;
      case "farthest-deadline":
        return w >= 15;
      default:
        return true;
    }
  };

  const matchesFilters = (s: Scholarship) =>
    matchesSearch(s) &&
    matchesAmount(s) &&
    matchesMajor(s) &&
    matchesGPA(s) &&
    matchesDeadline(s);

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
      if (!res.ok) throw new Error("Failed to update bookmark");
      const updated = await res.json();
      setScholarships((prev) => prev.map((s) => (s.id === id ? updated : s)));
      await fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Error: Failed to update bookmark status");
    }
  };

  if (loading || userLoading) {
    return <p className="text-center mt-8">Loading...</p>;
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="py-4 bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-center">
        <h1 className="text-2xl font-bold text-white">Matched Scholarships</h1>
      </header>

      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <select
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Amount</option>
          <option value="$1000+">$1k+</option>
          <option value="$5000+">$5k+</option>
          <option value="$10000+">$10k+</option>
        </select>
        <select
          value={majorFilter}
          onChange={(e) => setMajorFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Major</option>
          {allMajors.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={gpaFilter}
          onChange={(e) => setGpaFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">GPA</option>
          {allGPA.map((g) => (
            <option key={g} value={g.toString()}>
              {g.toFixed(1)}+
            </option>
          ))}
        </select>
        <select
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Deadline</option>
          <option value="approaching-soon">≤4w</option>
          <option value="4+">4w+</option>
          <option value="6+">6w+</option>
          <option value="12+">12w+</option>
          <option value="farthest-deadline">15w+</option>
        </select>
      </div>

      {/* Scholarship Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {available.filter(matchesFilters).length > 0 ? (
          available.filter(matchesFilters).map((s) => (
            <div
              key={s.id}
              className="p-6 bg-white rounded shadow flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">{s.name}</h3>
              <p className="text-gray-600 mb-1">
                Amount: ${s.amount.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-1">
                Deadline:{" "}
                {s.deadline ? new Date(s.deadline).toLocaleDateString() : "N/A"}
              </p>
              <div className="mt-auto flex space-x-2">
                <Link
                  href={`/scholarships/${s.id}`}
                  className="flex-1 bg-[#ab0520] text-white py-2 text-center rounded"
                >
                  Learn More
                </Link>
                <button
                  onClick={() => router.push(`/FillApp?scholarshipId=${s.id}`)}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No scholarships match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
