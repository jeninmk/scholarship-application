"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  donor_id: number;
  apply_info?: string;
  is_active: boolean;
}

interface Application {
  id: number;
  applicant: number;
  data: any; // e.g., contains essay, GPA, major, etc.
  submitted_at: string;
}

export default function DonorScholarshipDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    // Fetch scholarship details
    fetch(`http://localhost:8000/api/scholarships/${id}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Scholarship not found");
        return res.json();
      })
      .then((data) => setScholarship(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Fetch applications for this scholarship
    fetch(`http://localhost:8000/api/applications/applications/?scholarship=${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch((err) => console.error("Error fetching applications:", err));
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading scholarship details...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!scholarship) return <p className="text-center mt-8">Scholarship not found.</p>;

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

      {/* Scholarship Details */}
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4">{scholarship.name}</h2>
        <p className="text-gray-700 mb-2">
          <strong>Amount:</strong> ${scholarship.amount}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Status:</strong> {scholarship.is_active ? "Active" : "Inactive"}
        </p>
        {scholarship.apply_info && (
          <p className="text-gray-700 mb-2">
            <strong>Apply Info:</strong>{" "}
            <a
              href={scholarship.apply_info}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {scholarship.apply_info}
            </a>
          </p>
        )}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Applications</h3>
          {applications.length === 0 ? (
            <p>No applications found for this scholarship.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Applicant</th>
                  <th className="py-2 px-4 border">Submitted At</th>
                  <th className="py-2 px-4 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{app.id}</td>
                    <td className="py-2 px-4 border">{app.applicant}</td>
                    <td className="py-2 px-4 border">
                      {new Date(app.submitted_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition"
                        onClick={() => router.push(`/admin/applications/${app.id}/edit`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}