"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ApplicationData {
  [key: string]: any;
}

interface Scholarship {
  id: number;
  name: string;
  donor_id?: number;
}

interface Application {
  id: number;
  applicant: number;
  scholarship: Scholarship | number;
  data: ApplicationData;
  submitted_at: string;
  favorited_by_donor: boolean;
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [gpaFilter, setGpaFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [donorIdFilter, setDonorIdFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = () => {
    let url = "http://localhost:8000/api/applications/applications/";
    if (gpaFilter) {
      url += `?field=gpa&value=${encodeURIComponent(gpaFilter)}`;
    } else if (majorFilter) {
      url += `?field=major&value=${encodeURIComponent(majorFilter)}`;
    } else if (yearFilter) {
      url += `?field=year&value=${encodeURIComponent(yearFilter)}`;
    } else if (donorIdFilter) {
      url += `?donor_id=${encodeURIComponent(donorIdFilter)}`;
    }

    setLoading(true);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [gpaFilter, majorFilter, yearFilter, donorIdFilter]);

  const handleEdit = (id: number) => {
    router.push(`/admin/applicationmanagement/${id}/edit`);
  };

  const handleStatusChange = (appId: number, newStatus: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    const updatedData = { ...app.data, status: newStatus };
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8000/api/applications/applications/${appId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ data: updatedData }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update application status");
        return res.json();
      })
      .then((updatedApp) => {
        setApplications((prev) =>
          prev.map((item) => (item.id === updatedApp.id ? updatedApp : item))
        );
        setError("");
      })
      .catch((err) => setError(err.message));
  };

  const getStatus = (app: Application) => app.data?.status || "pending";

  // Extracted main content to avoid nested ternary
  let mainContent;
  if (loading) {
    mainContent = (
      <p className="text-center text-xl">Loading applications...</p>
    );
  } else if (error) {
    mainContent = <p className="text-center text-red-500 text-xl">{error}</p>;
  } else {
    mainContent = (
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Applicant</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Scholarship</th>
              <th className="py-3 px-4 border">Submitted At</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{app.id}</td>
                <td className="py-2 px-4 border">{app.applicant}</td>
                <td className="py-2 px-4 border">{getStatus(app)}</td>
                <td className="py-2 px-4 border">
                  {typeof app.scholarship === "object"
                    ? app.scholarship.name
                    : app.scholarship}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(app.submitted_at).toLocaleString()}
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    onClick={() => handleStatusChange(app.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleStatusChange(app.id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                    onClick={() => handleEdit(app.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md w-full mb-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">Application Management</h1>
          </div>
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="w-full mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">Filter Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">GPA</span>
            <input
              type="text"
              placeholder="e.g. 3.5"
              value={gpaFilter}
              onChange={(e) => setGpaFilter(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Major</span>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Year</span>
            <input
              type="text"
              placeholder="e.g. Freshman"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Donor ID</span>
            <input
              type="text"
              placeholder="e.g. 2"
              value={donorIdFilter}
              onChange={(e) => setDonorIdFilter(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <div className="flex items-end">
            <button
              onClick={fetchApplications}
              className="w-full bg-[#0C234B] text-white px-3 py-2 rounded hover:bg-blue-900 transition"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {mainContent}
    </div>
  );
}
