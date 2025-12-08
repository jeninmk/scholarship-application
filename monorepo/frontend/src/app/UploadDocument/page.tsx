"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function UploadDocumentPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "upload-documents" | "my-documents" | "edit-account"
  >("upload-documents");
  const [documents, setDocuments] = useState<
    Array<{ id: number; file: string; uploaded_at: string; file_type?: string }>
  >([]);
  const [profile, setProfile] = useState<{ gpa: string; major: string }>({
    gpa: "",
    major: "",
  });
  const [profileMessage, setProfileMessage] = useState("");

  // Fetch uploaded documents
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:8000/api/documents/", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      localStorage.setItem("currentUserId", data.id);
      setProfile({ gpa: data.gpa || "", major: data.major || "" });
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  // Programmatic download
  const handleDownload = async (fileUrl: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(fileUrl, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to download file");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      // Use nullish coalescing to default only if pop() returns null/undefined:
      link.download = fileUrl.split("/").pop() ?? "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to download file");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
    fetchCurrentUser();
  }, []);

  // File upload handler
  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/api/documents/upload/", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload document");
      await fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Error uploading document");
    }
  };

  // Delete handler
  const handleDelete = async (documentId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://127.0.0.1:8000/api/documents/${documentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete document");
      await fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Error deleting document");
    }
  };

  // Profile input change
  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Profile update submit
  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const currentUser = await fetchCurrentUser();
      const userId = currentUser.id;
      if (!userId) throw new Error("User not logged in.");
      const res = await fetch(
        `http://127.0.0.1:8000/api/accounts/users/${userId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(profile),
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileMessage("Error updating profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
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
          <nav>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => {
                localStorage.removeItem("authToken");
                router.push("/login");
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "upload-documents"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("upload-documents")}
              >
                Upload Documents
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "my-documents"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("my-documents")}
              >
                My Documents
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedOption === "edit-account"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOption("edit-account")}
              >
                Edit Account Information
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-3 py-2 rounded bg-[#0C234B] text-white hover:bg-blue-700 transition"
                onClick={() => router.push("/Dashboard")}
              >
                Go to Dashboard
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6">
          {selectedOption === "upload-documents" && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Upload Documents
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl space-y-4">
                {[
                  { label: "Application", key: "application" },
                  { label: "Essay", key: "essay" },
                  { label: "Letter of Recommendation", key: "recommendation" },
                  { label: "Transcript", key: "transcript" },
                  { label: "Resume", key: "resume" },
                ].map(({ label, key }) => (
                  <label
                    key={key}
                    className="flex flex-col font-semibold text-gray-700"
                  >
                    {label}:
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, key)}
                      className="border rounded p-2 mt-1"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {selectedOption === "my-documents" && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                My Documents
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl">
                {documents.length === 0 ? (
                  <p className="text-center text-gray-500">
                    You currently have no documents uploaded.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <span className="font-semibold text-gray-700 capitalize">
                          {doc.file_type || "Document"}:
                        </span>
                        <button
                          onClick={() => handleDownload(doc.file)}
                          className="text-blue-500 underline"
                        >
                          {doc.file.split("/").pop() ?? "Download"}
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {selectedOption === "edit-account" && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Edit Account Information
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <label className="flex flex-col font-semibold text-gray-700">
                    GPA:
                    <input
                      type="text"
                      name="gpa"
                      value={profile.gpa}
                      onChange={handleProfileChange}
                      className="border rounded p-2 mt-1"
                      placeholder="Enter your GPA"
                    />
                  </label>
                  <label className="flex flex-col font-semibold text-gray-700">
                    Major:
                    <input
                      type="text"
                      name="major"
                      value={profile.major}
                      onChange={handleProfileChange}
                      className="border rounded p-2 mt-1"
                      placeholder="Enter your Major"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-[#0C234B] text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                  {profileMessage && (
                    <p className="text-center text-sm mt-2">{profileMessage}</p>
                  )}
                </form>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
