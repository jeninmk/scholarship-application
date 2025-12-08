"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function ApplyPage() {
  const [selectedOption, setSelectedOption] = useState<
    "quick-apply" | "saved-scholarships" | "my-applications"
  >("quick-apply");
  const [savedApplications, setSavedApplications] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("savedApplications");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  });
  const [scholarships, setScholarships] = useState<any[]>([]);
  const router = useRouter();

  // Fetch scholarships function
  const fetchScholarships = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:8000/api/scholarships/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch scholarships");
      const data = await res.json();
      setScholarships(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  // Load saved applications on page load
  useEffect(() => {
    const storedApplications = localStorage.getItem("savedApplications");
    if (storedApplications) {
      const parsed = JSON.parse(storedApplications);
      setSavedApplications(Array.isArray(parsed) ? parsed : []);
    }
  }, []);

  // Optimistically toggle bookmark status then re-fetch
  const toggleBookmark = async (id: number) => {
    const current = scholarships.find((s) => s.id === id);
    if (!current) return;
    setScholarships((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_bookmarked: !s.is_bookmarked } : s
      )
    );
    const newStatus = !current.is_bookmarked;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/scholarships/${id}/bookmark/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ saved: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update bookmark status");
      await fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Error: Failed to update bookmark status");
      // revert
      setScholarships((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_bookmarked: current.is_bookmarked } : s
        )
      );
    }
  };

  // Delete a saved application
  const handleDeleteApplication = (scholarshipId: number) => {
    const updated = savedApplications.filter(
      (app) => app.scholarshipId !== scholarshipId
    );
    setSavedApplications(updated);
    localStorage.setItem("savedApplications", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">UASAMS</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <select
                className="text-black px-2 py-1 rounded"
                defaultValue="I am"
              >
                <option>I am</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Admin</option>
              </select>
              <button className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition">
                Go
              </button>
            </div>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                localStorage.removeItem("username");
                router.push("/");
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "quick-apply"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("quick-apply")}
              >
                Quick Apply Scholarships
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "saved-scholarships"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("saved-scholarships")}
              >
                Saved Scholarships
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "my-applications"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("my-applications")}
              >
                My Applications
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-3 py-2 rounded bg-[#0C234B] text-white hover:bg-blue-700 transition"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </button>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="w-3/4 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Apply for Scholarships
          </h2>

          {/* Quick Apply */}
          {selectedOption === "quick-apply" && (
            <div className="space-y-6">
              {scholarships
                .filter((s) => !s.is_bookmarked)
                .map((scholarship) => {
                  const app = savedApplications.find(
                    (a) => a.scholarshipId === scholarship.id
                  );
                  return (
                    <div
                      key={scholarship.id}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {scholarship.name}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {scholarship.description}
                      </p>
                      <div className="flex space-x-3">
                        {app ? (
                          <button
                            className="bg-green-500 text-white py-1.5 px-3 rounded hover:bg-green-700 transition text-sm"
                            onClick={() =>
                              router.push(
                                `/Application?scholarshipId=${scholarship.id}`
                              )
                            }
                          >
                            View/Edit
                          </button>
                        ) : (
                          <button
                            className="bg-[#0C234B] text-white py-1.5 px-3 rounded hover:bg-blue-900 transition text-sm"
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  "http://127.0.0.1:8000/api/applications/",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({
                                      scholarshipId: scholarship.id,
                                    }),
                                  }
                                );
                                if (!res.ok)
                                  throw new Error(
                                    "Failed to submit application"
                                  );
                                const newApp = await res.json();
                                const updated = [...savedApplications, newApp];
                                setSavedApplications(updated);
                                localStorage.setItem(
                                  "savedApplications",
                                  JSON.stringify(updated)
                                );
                                setScholarships((prev) =>
                                  prev.map((s) =>
                                    s.id === scholarship.id
                                      ? { ...s, is_bookmarked: true }
                                      : s
                                  )
                                );
                                setTimeout(() => {
                                  router.push(
                                    `/Application?scholarshipId=${scholarship.id}`
                                  );
                                }, 300);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Quick Apply
                          </button>
                        )}
                        <button
                          className="bg-gray-300 text-black py-1.5 px-3 rounded hover:bg-gray-400 transition text-sm"
                          onClick={() => toggleBookmark(scholarship.id)}
                        >
                          {scholarship.is_bookmarked
                            ? "Unsave Scholarship"
                            : "Save Scholarship"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Saved Scholarships */}
          {selectedOption === "saved-scholarships" && (
            <div className="space-y-6">
              {scholarships
                .filter((s) => s.is_bookmarked)
                .map((scholarship) => {
                  const app = savedApplications.find(
                    (a) => a.scholarshipId === scholarship.id
                  );
                  return (
                    <div
                      key={scholarship.id}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {scholarship.name}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {scholarship.description}
                      </p>
                      <div className="flex space-x-3">
                        {app ? (
                          <button
                            className="bg-green-500 text-white py-1.5 px-3 rounded hover:bg-green-700 transition text-sm"
                            onClick={() =>
                              router.push(
                                `/Application?scholarshipId=${scholarship.id}`
                              )
                            }
                          >
                            View/Edit
                          </button>
                        ) : (
                          <button
                            className="bg-[#0C234B] text-white py-1.5 px-3 rounded hover:bg-blue-900 transition text-sm"
                            onClick={() =>
                              router.push(
                                `/Application?scholarshipId=${scholarship.id}`
                              )
                            }
                          >
                            Quick Apply
                          </button>
                        )}
                        <button
                          className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-700 transition text-sm"
                          onClick={() => toggleBookmark(scholarship.id)}
                        >
                          Unsave Scholarship
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* My Applications */}
          {selectedOption === "my-applications" && (
            <div className="space-y-6">
              {savedApplications.length > 0 ? (
                savedApplications.map((application) => (
                  <div
                    key={application.scholarshipId}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {scholarships.find(
                        (s) => s.id === application.scholarshipId
                      )?.name || "Unknown Scholarship"}{" "}
                      Application
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Application Status: {application.status}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        className="bg-[#0C234B] text-white py-1.5 px-3 rounded hover:bg-blue-900 transition text-sm"
                        onClick={() =>
                          router.push(
                            `/Application?scholarshipId=${application.scholarshipId}`
                          )
                        }
                      >
                        View/Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-700 transition text-sm"
                        onClick={() =>
                          handleDeleteApplication(application.scholarshipId)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-700">
                  No saved or submitted applications yet.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
