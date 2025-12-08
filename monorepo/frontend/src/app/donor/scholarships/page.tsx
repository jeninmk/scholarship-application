"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  donor_id?: number;
  apply_info?: string;
  is_active: boolean;
}

export default function DonorScholarshipsPage() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 1. Force donorId to be "2" in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("donorId", "2");
  }

  // 2. Read donorId from localStorage
  let donorId: number = 2;
  if (typeof window !== "undefined") {
    const donorIdString = localStorage.getItem("donorId");
    if (donorIdString) {
      donorId = parseInt(donorIdString);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!donorId || !token) {
      setError("Donor not authenticated. Please log in as a donor.");
      setLoading(false);
      return;
    }
    // Use the donor-specific endpoint to fetch scholarships
    fetch(`http://127.0.0.1:8000/api/scholarships/donor/${donorId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch scholarships");
        }
        return res.json();
      })
      .then((data: Scholarship[]) => {
        console.log("Fetched scholarships for donorId=", donorId, ":", data);
        setScholarships(data);
        setLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        setLoading(false);
      });
  }, [donorId]);

  // Filter scholarships by search term
  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-8">Loading scholarships...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Red Bar Header */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          {/* Left side: UA Logo and Title */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">UASAMS</h1>
          </div>
          {/* Right side: Sign Out button */}
          <div>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                localStorage.removeItem("donorId");
                router.push("/dashboard");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4">
        <input
          type="text"
          placeholder="Search scholarships by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 text-gray-900 placeholder-gray-500 mb-2 md:mb-0"
        />
      </div>

      {/* Scholarship List */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="relative shadow-lg rounded-lg border p-6 flex flex-col transition-transform bg-white"
            >
              <h3 className="text-2xl font-semibold text-[#1e5288] mb-2">
                {scholarship.name}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Amount:</strong> $
                {Number(scholarship.amount).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Deadline:</strong>{" "}
                {scholarship.deadline
                  ? new Date(scholarship.deadline).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Apply Info:</strong>{" "}
                {scholarship.apply_info ? (
                  <a
                    href={scholarship.apply_info}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {scholarship.apply_info}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <div className="mt-auto">
                <Link
                  href={`/donor/scholarships/${scholarship.id}`}
                  className="block bg-[#ab0520] text-white text-center font-medium py-2 rounded hover:bg-[#8b0015] transition-colors"
                >
                  View Scholarship
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm col-span-3">
            No scholarships match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
