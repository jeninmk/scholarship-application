"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  donor_id?: number;
  apply_info?: string;
  is_active: boolean;
}

interface Application {
  id: number;
  applicant: number;
  data: {
    fullName?: string;
    // ... any other application details you store in the JSON field
  };
  submitted_at: string;
  favorited_by_donor?: boolean;
}

interface DonorScholarship {
  scholarship: Scholarship;
  applications: Application[];
}

export default function DonorApplicationsPage() {
  const router = useRouter();
  const [donorScholarships, setDonorScholarships] = useState<
    DonorScholarship[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Retrieve donorId from localStorage
  let donorId: number | null = null;
  if (typeof window !== "undefined") {
    const donorIdString = localStorage.getItem("donorId");
    if (donorIdString) {
      donorId = parseInt(donorIdString);
    }
  }

  useEffect(() => {
    if (!donorId) {
      setError("Donor not authenticated. Please log in as a donor.");
      setLoading(false);
      return;
    }

    // Fetch donor's scholarships from the backend
    fetch("http://127.0.0.1:8000/api/scholarships/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch scholarships");
        return res.json();
      })
      .then((data: Scholarship[]) => {
        // Filter scholarships that belong to the donor and are active
        const donorScholarshipsData = data.filter(
          (scholarship) =>
            scholarship.donor_id === donorId && scholarship.is_active
        );

        // For each scholarship, fetch its applications
        return Promise.all(
          donorScholarshipsData.map(async (scholarship) => {
            const response = await fetch(
              `http://127.0.0.1:8000/api/applications/applications/?scholarship=${scholarship.id}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch applications for scholarship ${scholarship.id}`
              );
            }
            const apps = await response.json();
            return { scholarship, applications: apps as Application[] };
          })
        );
      })
      .then((combinedData) => {
        setDonorScholarships(combinedData);
        setLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        setLoading(false);
      });
  }, [donorId]);

  if (loading)
    return <p className="text-center mt-8">Loading applications...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Red Bar */}
      <header className="w-full py-2 bg-[#ab0520] flex items-center px-4">
        <div className="flex items-center space-x-4">
          <img
            src="/images/ua-logo.png"
            alt="UA Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-white">
            My Scholarship Applicants
          </h1>
        </div>
        <button
          className="bg-white text-[#ab0520] px-3 py-1 rounded hover:bg-gray-200 transition ml-auto"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {donorScholarships.length > 0 ? (
          donorScholarships.map(({ scholarship, applications }) => (
            <div
              key={scholarship.id}
              className="mb-8 border rounded-lg shadow-md p-6 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1e5288]">
                    {scholarship.name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Amount:</strong> $
                    {Number(scholarship.amount).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Deadline:</strong>{" "}
                    {scholarship.deadline
                      ? new Date(scholarship.deadline).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Apply Info:</strong>{" "}
                    {scholarship.apply_info ? (
                      <a
                        href={scholarship.apply_info}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {scholarship.apply_info}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                {/* A "Review All" button – takes to the review page for the first applicant */}
                {applications.length > 0 && (
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={() =>
                      router.push(
                        `/donor/review?applicationId=${applications[0].id}`
                      )
                    }
                  >
                    Review All
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Applicants</h3>
              {applications.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  {applications.map((app) => {
                    // Use applicant's full name if available; otherwise, fallback to "Applicant {id}".
                    const applicantName =
                      app.data?.fullName ?? `Applicant ${app.id}`;
                    return (
                      <li
                        key={app.id}
                        className="flex items-center justify-between"
                      >
                        <button
                          className="text-left text-blue-600 underline hover:text-blue-800"
                          onClick={() =>
                            router.push(`/donor/review?applicationId=${app.id}`)
                          }
                        >
                          {applicantName}{" "}
                          {app.favorited_by_donor && (
                            <span title="Favorited" className="text-yellow-500">
                              ★
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-600">No applicants have applied.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            You have no active scholarships or no applications have been
            received.
          </p>
        )}
      </main>
    </div>
  );
}
