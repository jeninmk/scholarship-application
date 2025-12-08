"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  donor_id?: number;
  apply_info?: string;
  is_active: boolean;
}

export default function ScholarshipDetailAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
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

  if (!id)
    return (
      <p className="text-center mt-8">Error: No scholarship ID provided.</p>
    );
  if (loading)
    return (
      <p className="text-center mt-8">
        Loading scholarship details for ID: {id}...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!scholarship)
    return <p className="text-center mt-8">No scholarship found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar Header */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/images/ua-logo.png"
            alt="UA Logo"
            className="h-10 w-auto"
          />
        </div>
        <nav className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/role-requests")}
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Role Requests
          </button>
          <button
            onClick={() => router.push("/donor/reports")}
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Donor Reports
          </button>
        </nav>
      </header>

      {/* Scholarship Details Widget */}
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-4xl font-bold mb-6 text-[#1e5288] text-center">
          {scholarship.name}
        </h2>
        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <strong>Amount:</strong> ${scholarship.amount}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(scholarship.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {scholarship.is_active ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Donor ID:</strong> {scholarship.donor_id ?? "N/A"}
          </p>
          {scholarship.apply_info && (
            <p>
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
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-2">Description</h3>
          {scholarship.description.split("\n").map((paragraph, idx) => {
            // key includes idx and start of paragraph to remain stable
            const key = `desc-${idx}-${paragraph.slice(0, 10)}`;
            return (
              <p key={key} className="mb-2">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Centered Edit Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-700 transition"
            onClick={() =>
              router.push(`/admin/scholarships/${scholarship.id}/edit`)
            }
          >
            Edit Scholarship
          </button>
        </div>
      </main>
    </div>
  );
}
