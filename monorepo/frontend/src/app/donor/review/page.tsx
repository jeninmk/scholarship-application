"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Define the shape of the application data stored in the JSON field.
interface ApplicationData {
  fullName?: string;
  preferredPronoun?: string;
  studentId?: string;
  major?: string;
  minor?: string;
  gpa?: string;
  currentYear?: string;
  ethnicity?: string;
  personalStatement?: string;
  workExperience?: string;
  transcript?: string;
  recommendation?: string;
  resume?: string;
  essayFile?: string;
  // ... add any other fields as needed
}

// Define the Application type.
interface Application {
  id: number;
  applicant: number;
  scholarship: number;
  data: ApplicationData;
  submitted_at: string;
  favorited_by_donor?: boolean; // expects a Boolean; if true, donor has favorited this application
}

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationIdParam = searchParams.get("applicationId");
  const applicationId = applicationIdParam ? Number(applicationIdParam) : null;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);

  // Fetch the application details for review.
  const fetchApplication = async () => {
    if (!applicationId) {
      setError("No application specified.");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/applications/applications/${applicationId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch application details.");
      }
      const data = await res.json();
      // Log the fetched data for debugging (remove in production)
      console.log("Fetched application:", data);
      setApplication(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching application:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  // Handle toggling the favorite status.
  const handleFavorite = async () => {
    if (!applicationId) return;
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/applications/applications/${applicationId}/favorite/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ favorite: !application?.favorited_by_donor }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update favorite status");
      }
      // Re-fetch the application details to update the UI.
      await fetchApplication();
    } catch (error) {
      console.error("Favorite error:", error);
      alert("There was an error updating the favorite status.");
    }
    setFavoriteLoading(false);
  };

  // Navigation handlers.
  const handleBackToApplications = () => {
    router.push("/donor/applications");
  };

  const handleNext = () => {
    // For now, the "Next" button routes back to the applications list.
    router.push("/donor/applications");
  };

  if (loading)
    return <p className="text-center mt-8">Loading application details...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  if (!application)
    return <p className="text-center mt-8">Application not found.</p>;

  // Helper to render a label/value field.
  const renderField = (label: string, value?: string) => (
    <div className="mb-3">
      <span className="font-semibold">{label}: </span>
      <span>{value && value.trim() !== "" ? value : "N/A"}</span>
    </div>
  );

  // Helper to render a document field with a clickable link.
  const renderDocumentField = (
    docLabel: string,
    fileUrl?: string,
    fallback = "Using existing file"
  ) => (
    <div className="mb-2">
      <strong>{docLabel}: </strong>
      {fileUrl && fileUrl.trim() !== "" ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {fileUrl.split("/").pop()}
        </a>
      ) : (
        fallback
      )}
    </div>
  );

  // Extract favorite button text into its own logic (no nested ternary in JSX)
  let favoriteButtonText: string;
  if (favoriteLoading) {
    favoriteButtonText = "Processing...";
  } else if (application.favorited_by_donor) {
    favoriteButtonText = "Unfavorite";
  } else {
    favoriteButtonText = "Favorite";
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header with red gradient and navigation buttons */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/images/ua-logo.png"
            alt="UA Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold">UASAMS</h1>
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
            onClick={handleBackToApplications}
          >
            Applications
          </button>
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 p-6 max-w-3xl mx-auto bg-white rounded shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-center border-b pb-4">
          Review Application
        </h2>

        {/* Applicant Details Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Applicant Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center">
              {renderField("Full Name", application.data.fullName)}
              {application.favorited_by_donor && (
                <span
                  className="ml-2 text-yellow-500 text-xl"
                  title="Favorited"
                >
                  ★
                </span>
              )}
            </div>
            {renderField("Student ID", application.data.studentId)}
            {renderField("Major", application.data.major)}
            {renderField("GPA", application.data.gpa)}
            {renderField("Current Year", application.data.currentYear)}
            {renderField("Ethnicity", application.data.ethnicity)}
          </div>
        </section>

        {/* Application Essay Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Application Essay</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {application.data.personalStatement ||
              "No personal statement provided."}
          </p>
        </section>

        {/* Work Experience Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {application.data.workExperience || "No work experience provided."}
          </p>
        </section>

        {/* Uploaded Documents Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Uploaded Documents</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              {renderDocumentField("Transcript", application.data.transcript)}
            </li>
            <li>
              {renderDocumentField(
                "Recommendation Letter",
                application.data.recommendation
              )}
            </li>
            <li>{renderDocumentField("Resume/CV", application.data.resume)}</li>
            <li>
              {renderDocumentField(
                "Essay File",
                application.data.essayFile,
                "No file uploaded"
              )}
            </li>
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            onClick={handleBackToApplications}
          >
            Back to Applications
          </button>
          <div className="flex space-x-3">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              {favoriteButtonText}
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
