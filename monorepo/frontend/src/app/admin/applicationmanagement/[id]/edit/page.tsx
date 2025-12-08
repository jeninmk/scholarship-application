"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Application {
  id: number;
  applicant: number;
  scholarship: number;
  data: Record<string, any>;
  submitted_at: string;
}

export default function EditApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/applications/applications/${id}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Application not found");
        return res.json();
      })
      .then((data) => setApplication(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (!application) return;
    if (name === "applicant" || name === "scholarship") {
      setApplication({ ...application, [name]: Number(value) });
    } else {
      const dataKey = name.replace("data_", "");
      setApplication({
        ...application,
        data: { ...application.data, [dataKey]: value },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:8000/api/applications/applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(application),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      setSuccess("Application updated successfully!");
      setError("");
    } catch {
      setError("Update failed");
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading application details...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!application)
    return <p className="text-center mt-8">Application not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">UASAMS Admin</h1>
          </div>
          <nav>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Edit Application
        </h2>
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="font-semibold">Application ID</span>
            <input
              type="text"
              value={application.id}
              readOnly
              className="mt-1 w-full p-2 border rounded bg-gray-100"
            />
          </label>

          <label className="block">
            <span className="font-semibold">Applicant ID</span>
            <input
              type="number"
              name="applicant"
              value={application.applicant}
              readOnly
              className="mt-1 w-full p-2 border rounded bg-gray-100"
            />
          </label>

          <label className="block">
            <span className="font-semibold">Scholarship ID</span>
            <input
              type="number"
              name="scholarship"
              value={application.scholarship}
              readOnly
              className="mt-1 w-full p-2 border rounded bg-gray-100"
            />
          </label>

          <label className="block">
            <span className="font-semibold">Essay</span>
            <textarea
              name="data_essay"
              value={application.data.essay || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={5}
            />
          </label>

          <label className="block">
            <span className="font-semibold">GPA</span>
            <input
              type="text"
              name="data_gpa"
              value={application.data.gpa || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Add additional fields below as needed */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
