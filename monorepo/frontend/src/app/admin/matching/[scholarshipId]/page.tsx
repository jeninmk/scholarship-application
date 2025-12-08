"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Match {
  applicant_id: number;
  applicant_name: string;
  score: number;
  gpa: number;
  major: string;
}

export default function ScholarshipMatchesPage() {
  const { scholarshipId } = useParams() as { scholarshipId: string };
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scholarshipId) return;
    // Fetch ranked matches for the scholarship from backend
    fetch(`http://localhost:8000/api/matching/scholarship/${scholarshipId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch matching results");
        return res.json();
      })
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        setLoading(false);
      });
  }, [scholarshipId]);

  const handleOverride = (applicantId: number, newScore: number) => {
    // This is where you’d send a PATCH/PUT request to update the match score manually.
    // For now, we just log the new score.
    console.log(`Override score for applicant ${applicantId} to ${newScore}`);
    // After updating, you might refetch the matches.
  };

  if (loading) return <p className="text-center mt-8">Loading matching results...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold">UASAMS Admin</h1>
          </div>
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
            onClick={() => router.push("/admin/matching")}
          >
            Back to Matching Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Ranked Applicants</h2>
        {matches.length === 0 ? (
          <p className="text-center">No matching applicants found for this scholarship.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Applicant ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">GPA</th>
                <th className="py-2 px-4 border">Major</th>
                <th className="py-2 px-4 border">Score</th>
                <th className="py-2 px-4 border">Override</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.applicant_id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{match.applicant_id}</td>
                  <td className="py-2 px-4 border">{match.applicant_name}</td>
                  <td className="py-2 px-4 border">{match.gpa}</td>
                  <td className="py-2 px-4 border">{match.major}</td>
                  <td className="py-2 px-4 border">{match.score}</td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      placeholder="New Score"
                      className="p-1 border rounded w-full"
                      onBlur={(e) =>
                        handleOverride(match.applicant_id, Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}