"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Application {
  id: number;
  applicant: number;
  scholarship: number;
  data: Record<string, any>; // Contains details like essay, GPA, etc.
  submitted_at: string;
}

export default function ApplicationDetailAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchApplication() {
      try {
        const response = await fetch(`http://localhost:8000/api/applications/applications/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies (and tokens) are sent if needed
        });

        if (!response.ok) {
          throw new Error("Application not found");
        }

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  if (!id) return <p>Error: No application ID provided.</p>;
  if (loading) return <p className="text-center mt-8">Loading application details for ID: {id}...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!application) return <p className="text-center mt-8">No application found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold">UASAMS Admin</h1>
          </div>
          <nav>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/admin/applications")}
            >
              Back to Applications
            </button>
          </nav>
        </div>
      </header>

      {/* Application Details */}
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Application Details</h2>
        <p className="text-gray-700 mb-2"><strong>Application ID:</strong> {application.id}</p>
        <p className="text-gray-700 mb-2"><strong>Applicant ID:</strong> {application.applicant}</p>
        <p className="text-gray-700 mb-2"><strong>Scholarship ID:</strong> {application.scholarship}</p>
        <p className="text-gray-700 mb-2">
          <strong>Submitted At:</strong> {new Date(application.submitted_at).toLocaleString()}
        </p>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold mb-2">Application Data</h3>
          {Object.entries(application.data).map(([key, value]) => (
            <p key={key} className="text-gray-700">
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}