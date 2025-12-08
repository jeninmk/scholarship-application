"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Scholarship {
  id: number;
  name: string;
  description: string;
}

export default function MatchingDashboard() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all scholarships from backend (adjust URL if needed)
    fetch("http://localhost:8000/api/scholarships/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch scholarships");
        return res.json();
      })
      .then((data) => {
        setScholarships(data);
        setLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8">Loading scholarships...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold">UASAMS Admin</h1>
          </div>
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Matching Dashboard
        </h2>
        <div className="space-y-6">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            >
              <h3 className="text-lg font-bold mb-2">{scholarship.name}</h3>
              <p className="text-gray-700 mb-4">{scholarship.description}</p>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => router.push(`/admin/matching/${scholarship.id}`)}
              >
                View Ranked Applicants
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}