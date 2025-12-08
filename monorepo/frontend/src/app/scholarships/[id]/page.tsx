"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowBigLeft } from "lucide-react";

// Define the scholarship type
interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  founder?: string;
  apply_info?: string;
}

export default function ScholarshipDetail() {
  const params = useParams();
  const id = params.id as string;

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchScholarship() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/scholarships/${id}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Scholarship not found");
        const data = await response.json();
        setScholarship(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchScholarship();
  }, [id]);

  if (!id) return <p>Error: No ID found in URL.</p>;
  if (loading) return <p>Loading scholarship details for ID: {id}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!scholarship) return <p>No scholarship found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full py-2 bg-[#ab0520] flex items-center justify-center px-4 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-1 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-300 transition"
        >
          <ArrowBigLeft className="w-5 h-5 text-[#ab0520]" />
        </button>
        <img
          src="/ua_wordmark_line_logo_white_rgb.min.svg"
          alt="UA Logo"
          className="ml-10 w-96 h-auto object-contain"
        />
      </div>

      <h1 className="p-7 text-4xl font-semibold text-[#1e5288]">
        {scholarship.name}
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
        <h3 className="text-2xl font-semibold mb-4">Details</h3>
        <p>
          <strong>Amount:</strong> ${scholarship.amount}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {new Date(scholarship.deadline).toLocaleDateString()}
        </p>
        <p>
          <strong>Description:</strong>
        </p>
        {scholarship.description.split("\n").map((paragraph) => (
          <p key={paragraph} className="mb-2">
            {paragraph}
          </p>
        ))}
        {scholarship.founder && (
          <p>
            <strong>Founder:</strong> {scholarship.founder}
          </p>
        )}
        {scholarship.apply_info && (
          <p>
            <strong>Apply here:</strong>{" "}
            <a
              href={scholarship.apply_info}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {scholarship.apply_info}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
