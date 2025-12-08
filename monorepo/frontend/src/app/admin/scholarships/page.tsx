"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  requires_transcript?: boolean;
  requires_recommendation?: boolean;
  min_gpa?: string;
  allowed_major?: string;
  donor_id?: number;
}

type FilterType = "All";
type OptionType = "list" | "create" | "reports";

/** List view component */
function ScholarshipListView({
  scholarships,
  filter,
  setFilter,
  onDelete,
  router,
}: Readonly<{
  scholarships: Scholarship[];
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  onDelete: (id: number) => void;
  router: ReturnType<typeof useRouter>;
}>) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <label className="flex flex-col">
          Filter Scholarships
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="mt-1 p-2 border rounded"
          >
            <option value="All">All Scholarships</option>
          </select>
        </label>
      </div>
      {scholarships
        .filter((sch) => filter === "All")
        .map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
          >
            <h3 className="text-lg font-bold mb-2">{sch.name}</h3>
            <p className="text-gray-700 mb-4">{sch.description}</p>
            <p className="text-gray-700 mb-2">
              <strong>Amount:</strong> ${sch.amount}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Deadline:</strong>{" "}
              {new Date(sch.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Requires Transcript:</strong>{" "}
              {sch.requires_transcript ? "Yes" : "No"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Requires Recommendation:</strong>{" "}
              {sch.requires_recommendation ? "Yes" : "No"}
            </p>
            {sch.min_gpa && (
              <p className="text-gray-700 mb-2">
                <strong>Min GPA:</strong> {sch.min_gpa}
              </p>
            )}
            {sch.allowed_major && (
              <p className="text-gray-700 mb-2">
                <strong>Allowed Major:</strong> {sch.allowed_major}
              </p>
            )}
            {sch.donor_id && (
              <p className="text-gray-700 mb-2">
                <strong>Donor ID:</strong> {sch.donor_id}
              </p>
            )}
            <div className="flex space-x-3 mt-3">
              <button
                className="bg-green-500 text-white py-1.5 px-3 rounded hover:bg-green-700 text-sm"
                onClick={() =>
                  router.push(`/admin/scholarships/${sch.id}/edit`)
                }
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-700 text-sm"
                onClick={() => onDelete(sch.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white py-1.5 px-3 rounded hover:bg-blue-700 text-sm"
                onClick={() => router.push(`/admin/scholarships/${sch.id}`)}
              >
                More Info
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

/** Create view component */
function CreateScholarshipView({
  setScholarships,
  setSelectedOption,
}: Readonly<{
  setScholarships: React.Dispatch<React.SetStateAction<Scholarship[]>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<OptionType>>;
}>) {
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    deadline: "",
    requiresTranscript: false,
    requiresRecommendation: false,
    minGpa: "",
    allowedMajor: "",
    donorId: "2",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/scholarships/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        amount: formData.amount,
        deadline: formData.deadline,
        requires_transcript: formData.requiresTranscript,
        requires_recommendation: formData.requiresRecommendation,
        min_gpa: formData.minGpa,
        allowed_major: formData.allowedMajor,
        donor_id: Number(formData.donorId),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error creating scholarship");
        return res.json();
      })
      .then((data: Scholarship) => {
        setScholarships((prev) => [...prev, data]);
        setFormData({
          name: "",
          description: "",
          amount: "",
          deadline: "",
          requiresTranscript: false,
          requiresRecommendation: false,
          minGpa: "",
          allowedMajor: "",
          donorId: "2",
        });
        setSelectedOption("list");
      })
      .catch((error) => console.error("Create error:", error));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-4">Create New Scholarship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col font-semibold">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="flex flex-col font-semibold">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="flex flex-col font-semibold">
          Amount
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="flex flex-col font-semibold">
          Deadline
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="flex items-center space-x-2 font-semibold">
          <input
            type="checkbox"
            name="requiresTranscript"
            checked={formData.requiresTranscript}
            onChange={handleChange}
          />
          <span>Requires Transcript?</span>
        </label>

        <label className="flex items-center space-x-2 font-semibold">
          <input
            type="checkbox"
            name="requiresRecommendation"
            checked={formData.requiresRecommendation}
            onChange={handleChange}
          />
          <span>Requires Recommendation?</span>
        </label>

        <label className="flex flex-col font-semibold">
          Min GPA
          <input
            type="text"
            name="minGpa"
            value={formData.minGpa}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            placeholder="e.g., 3.2"
          />
        </label>

        <label className="flex flex-col font-semibold">
          Allowed Major
          <input
            type="text"
            name="allowedMajor"
            value={formData.allowedMajor}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            placeholder="e.g., Engineering"
          />
        </label>

        <label className="flex flex-col font-semibold">
          Donor ID
          <input
            type="text"
            name="donorId"
            value={formData.donorId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            placeholder="e.g., 2"
          />
          <span className="text-sm text-gray-500 mt-1">
            Enter the donor user ID who owns this scholarship.
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-[#0C234B] text-white py-2 rounded hover:bg-blue-900 transition"
        >
          Create Scholarship
        </button>
      </form>
    </div>
  );
}

/** Reports view component */
function ReportsView() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-4">Scholarship Reports</h2>
      <p>Place any reporting metrics here...</p>
    </div>
  );
}

export default function AdminScholarshipsPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<OptionType>("list");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://127.0.0.1:8000/api/scholarships/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch scholarships");
        return res.json();
      })
      .then((data: Scholarship[]) => setScholarships(data))
      .catch((error) => console.error("Error fetching scholarships:", error));
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    const token = localStorage.getItem("authToken");
    fetch(`http://127.0.0.1:8000/api/scholarships/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error deleting scholarship");
        setScholarships((prev) => prev.filter((sch) => sch.id !== id));
      })
      .catch((error) => console.error("Delete error:", error));
  };

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
            <h1 className="text-xl font-bold">UASAMS - Admin</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/admin/role-requests")}
            >
              Role Requests
            </button>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/donor/reports")}
            >
              Donor Reports
            </button>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-1/4 bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Scholarship Management</h3>
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "list"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("list")}
              >
                Scholarship List
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "create"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("create")}
              >
                Create Scholarship
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "reports"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("reports")}
              >
                Scholarship Reports
              </button>
            </li>
          </ul>
        </aside>

        <main className="w-3/4 p-6">
          {selectedOption === "list" && (
            <ScholarshipListView
              scholarships={scholarships}
              filter={filter}
              setFilter={setFilter}
              onDelete={handleDelete}
              router={router}
            />
          )}
          {selectedOption === "create" && (
            <CreateScholarshipView
              setScholarships={setScholarships}
              setSelectedOption={setSelectedOption}
            />
          )}
          {selectedOption === "reports" && <ReportsView />}
        </main>
      </div>
    </div>
  );
}
