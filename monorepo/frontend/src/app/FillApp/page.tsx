"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Define the shape of your form data.
interface FormData {
  scholarshipId: string;
  fullName: string;
  preferredPronoun: string;
  studentId: string;
  major: string;
  minor: string;
  gpa: string;
  currentYear: string;
  ethnicity: string;
  personalStatement: string;
  workExperience: string;
  transcript: string;
  recommendation: string;
  resume: string;
  essayFile: string;
}

export default function FillAppPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scholarshipId = searchParams.get("scholarshipId") || "";

  const [formData, setFormData] = useState<FormData>({
    scholarshipId,
    fullName: "",
    preferredPronoun: "",
    studentId: "",
    major: "",
    minor: "",
    gpa: "",
    currentYear: "",
    ethnicity: "",
    personalStatement: "",
    workExperience: "",
    transcript: "",
    recommendation: "",
    resume: "",
    essayFile: "",
  });
  const [submitError, setSubmitError] = useState<string>("");

  // Extract out a helper to set a document field if found:
  const trySetDoc = (docs: any[], key: keyof FormData, keyword: string) => {
    const found = docs.find((d) => d?.file?.toLowerCase().includes(keyword));
    if (found?.file) {
      setFormData((f) => ({ ...f, [key]: found.file }));
    }
  };

  // Fetch profile fields
  useEffect(() => {
    if (!localStorage.getItem("authToken")) return;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setFormData((f) => ({
          ...f,
          fullName: [data.first_name, data.last_name].filter(Boolean).join(" "),
          studentId: data.id?.toString() ?? "",
          major: data.major ?? "",
          gpa: data.gpa?.toString() ?? "",
          preferredPronoun: data.preferredPronoun ?? "",
          minor: data.minor ?? "",
          currentYear: data.currentYear ?? "",
          ethnicity: data.ethnicity ?? "",
          personalStatement: data.personalStatement ?? "",
          workExperience: data.workExperience ?? "",
        }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Fetch existing documents
  useEffect(() => {
    if (!localStorage.getItem("authToken")) return;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/documents/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!res.ok) return;
        const docs = await res.json();
        trySetDoc(docs, "transcript", "transcript");
        trySetDoc(docs, "recommendation", "recommendation");
        trySetDoc(docs, "resume", "resume");
        trySetDoc(docs, "essayFile", "essay");
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (["fullName", "studentId", "major", "gpa"].includes(name)) return;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    if (!e.target.files?.[0]) return;
    // simulate upload URL
    setFormData((f) => ({
      ...f,
      [field]: e.target.files ? URL.createObjectURL(e.target.files[0]) : "",
    }));
  };

  const isFormValid = () => {
    const required: (keyof FormData)[] = [
      "fullName",
      "studentId",
      "major",
      "gpa",
      "currentYear",
      "ethnicity",
      "personalStatement",
    ];
    return required.every((k) => formData[k]?.toString().trim() !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken")!;
      const { scholarshipId: sid, ...rest } = formData;
      const payload = {
        applicant: Number(formData.studentId),
        scholarship_id: Number(sid),
        data: rest,
      };
      const res = await fetch(
        "http://127.0.0.1:8000/api/applications/applications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to submit");
      alert("Application submitted successfully!");
      router.push("/MyApplications");
    } catch {
      setSubmitError("There was an error submitting your application.");
    }
  };

  const renderFileField = (name: keyof FormData, label: string) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700">
        {label}:
      </label>
      {formData[name] ? (
        <div>
          <a
            href={formData[name]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {(formData[name] as string).split("/").pop()!}
          </a>
          <p className="text-sm text-gray-500">(Using existing file.)</p>
        </div>
      ) : (
        <input
          id={name}
          type="file"
          onChange={(e) => handleFileChange(e, name)}
          accept=".pdf,.doc,.docx"
          className="w-full"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
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
          <button
            className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <ul className="space-y-4">
            <li>
              <button className="w-full text-left px-3 py-2 rounded bg-gray-200">
                Quick Apply
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded bg-gray-200">
                Fill Application
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-3 py-2 rounded bg-[#0C234B] text-white"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </button>
            </li>
          </ul>
        </aside>

        {/* Form */}
        <main className="w-3/4 p-6">
          <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Scholarship Application
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Personal Info */}
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  disabled
                  className="w-full p-2 border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="studentId" className="block text-gray-700">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={formData.studentId}
                  disabled
                  className="w-full p-2 border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="major" className="block text-gray-700">
                    Major <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="major"
                    type="text"
                    value={formData.major}
                    disabled
                    className="w-full p-2 border bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="minor" className="block text-gray-700">
                    Minor
                  </label>
                  <input
                    id="minor"
                    type="text"
                    name="minor"
                    value={formData.minor}
                    onChange={handleChange}
                    className="w-full p-2 border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="gpa" className="block text-gray-700">
                    GPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={formData.gpa}
                    disabled
                    className="w-full p-2 border bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="currentYear" className="block text-gray-700">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="currentYear"
                    type="text"
                    name="currentYear"
                    value={formData.currentYear}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="ethnicity" className="block text-gray-700">
                  Ethnicity <span className="text-red-500">*</span>
                </label>
                <input
                  id="ethnicity"
                  type="text"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  className="w-full p-2 border"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="personalStatement"
                  className="block text-gray-700"
                >
                  Personal Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="personalStatement"
                  name="personalStatement"
                  value={formData.personalStatement}
                  onChange={handleChange}
                  className="w-full p-2 border"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="workExperience" className="block text-gray-700">
                  Work Experience
                </label>
                <textarea
                  id="workExperience"
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>

              {/* Documents */}
              <h2 className="text-2xl font-semibold my-6">
                Supporting Documents
              </h2>
              {renderFileField("transcript", "Transcript")}
              {renderFileField("recommendation", "Recommendation Letter")}
              {renderFileField("resume", "Resume/CV")}
              {renderFileField("essayFile", "Essay File")}

              {submitError && (
                <p className="text-red-500 text-center mt-2">{submitError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#0C234B] text-white p-3 rounded hover:bg-blue-900 transition mt-6"
              >
                Submit Application
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
