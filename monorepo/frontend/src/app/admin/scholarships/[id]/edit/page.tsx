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
}

export default function EditScholarshipPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarship) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`http://localhost:8000/api/scholarships/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(scholarship),
      });
      if (!res.ok) throw new Error("Update failed");
      setSuccess("Scholarship updated successfully!");
      setError("");
    } catch {
      setError("Update failed");
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading scholarship details...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!scholarship)
    return <p className="text-center mt-8">Scholarship not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">UASAMS Admin</h1>
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
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Edit Scholarship
        </h1>
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex flex-col font-semibold">
            Name
            <input
              type="text"
              value={scholarship.name}
              onChange={(e) =>
                setScholarship({ ...scholarship, name: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="flex flex-col font-semibold">
            Description
            <textarea
              value={scholarship.description}
              onChange={(e) =>
                setScholarship({ ...scholarship, description: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              required
            />
          </label>

          <label className="flex flex-col font-semibold">
            Amount
            <input
              type="text"
              value={scholarship.amount}
              onChange={(e) =>
                setScholarship({ ...scholarship, amount: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="flex flex-col font-semibold">
            Deadline
            <input
              type="date"
              value={scholarship.deadline}
              onChange={(e) =>
                setScholarship({ ...scholarship, deadline: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="flex flex-col font-semibold">
            Donor ID
            <input
              type="number"
              value={scholarship.donor_id ?? ""}
              onChange={(e) =>
                setScholarship({
                  ...scholarship,
                  donor_id: parseInt(e.target.value),
                })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="flex flex-col font-semibold">
            Apply Info URL
            <input
              type="url"
              value={scholarship.apply_info || ""}
              onChange={(e) =>
                setScholarship({ ...scholarship, apply_info: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
