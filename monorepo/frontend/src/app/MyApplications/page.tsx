"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Scholarship {
  id: number;
  name: string;
  amount: number;
  deadline: string;
}

interface ApplicationData {
  // Assuming the application data includes a status field, along with any other details.
  status?: string;
  [key: string]: any;
}

interface Application {
  id: number;
  applicant: number;
  scholarship: Scholarship;
  data: ApplicationData;
  submitted_at: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Helper function to fetch current user info and extract the user ID.
  const fetchCurrentUserId = async (): Promise<number | null> => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return Number(data.id);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
    return null;
  };

  // Fetch applications belonging to the current user.
  const fetchApplications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const userId = await fetchCurrentUserId();
      if (!userId) {
        setError("Unable to determine current user.");
        setLoading(false);
        return;
      }
      // Assuming the backend supports filtering by applicant via a query parameter:
      const res = await fetch(
        `http://127.0.0.1:8000/api/applications/applications/?applicant=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (err: any) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle deletion of an application.
  const handleDelete = async (applicationId: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/applications/applications/${applicationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete application");
      // Remove the deleted application from state.
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    } catch (err: any) {
      console.error("Error deleting application:", err);
      setError(err.message || "Error deleting application");
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading your applications...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header with Dashboard button */}
      <header className="w-full py-4 bg-gradient-to-r from-[#AB0520] to-[#9B051F] flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <button
          className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
      </header>

      {/* Application Cards */}
      <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length > 0 ? (
          applications.map((app) => {
            const scholarship = app.scholarship;
            const status = app.data.status || "Submitted";
            return (
              <div
                key={app.id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
              >
                <h2 className="text-xl font-bold mb-2">{scholarship.name}</h2>
                <p className="text-gray-600 mb-1">
                  <strong>Amount:</strong> $
                  {Number(scholarship.amount).toLocaleString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Deadline:</strong>{" "}
                  {scholarship.deadline
                    ? new Date(scholarship.deadline).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Status:</strong> {status}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                </p>
                <div className="mt-auto flex justify-between">
                  <button
                    onClick={() =>
                      router.push(`/FillApp?applicationId=${app.id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    View/Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            You have not applied to any scholarships yet.
          </p>
        )}
      </div>
    </div>
  );
}
