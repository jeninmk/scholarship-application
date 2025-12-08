"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DonorReport {
  totalApplications: number;
  approvedApplications: number;
  successRate: number;
  contactInfo: string; // e.g. email or phone of selected recipient(s)
}

export default function DonorReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<DonorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Assume the donor's ID is stored in localStorage
  const donorId = localStorage.getItem("donorId");

  useEffect(() => {
    if (!donorId) {
      setError("Donor not authenticated.");
      setLoading(false);
      return;
    }
    // Fetch donor-specific reports (adjust endpoint as needed)
    fetch(`http://localhost:8000/api/donor/reports/${donorId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch donor reports");
        return res.json();
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        setLoading(false);
      });
  }, [donorId]);

  if (loading) return <p className="text-center mt-8">Loading reports...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!report) return <p className="text-center mt-8">No report data available.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold">UASAMS Donor</h1>
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Donor Reports</h2>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 mb-2">
            <strong>Total Applications:</strong> {report.totalApplications}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Approved Applications:</strong> {report.approvedApplications}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Success Rate:</strong> {report.successRate}%
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Contact Info:</strong> {report.contactInfo}
          </p>
        </div>
      </main>
    </div>
  );
}