"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ApplicationFormData = {
  fullName: string;
  pronoun?: string;
  studentID: string;
  major: string;
  minor?: string;
  gpa: string;
  currentYear: string;
  ethnicity: string;
  personalStatement: string;
  workExperience?: string;
  scholarshipId: string;
};

interface ApplicationFormProps {
  readonly scholarshipId: string;
}

export default function ApplicationForm({
  scholarshipId,
}: ApplicationFormProps) {
  const router = useRouter();
  const { register, handleSubmit, reset, getValues } =
    useForm<ApplicationFormData>({
      defaultValues: {
        fullName: "",
        pronoun: "",
        studentID: "",
        major: "",
        minor: "",
        gpa: "",
        currentYear: "",
        ethnicity: "",
        personalStatement: "",
        workExperience: "",
        scholarshipId,
      },
    });

  useEffect(() => {
    const savedApplications: ApplicationFormData[] = JSON.parse(
      localStorage.getItem("savedApplications") ?? "[]"
    );
    const existingApp = savedApplications.find(
      (app) => app.scholarshipId === scholarshipId
    );
    if (existingApp) {
      reset(existingApp);
    }
  }, [scholarshipId, reset]);

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://127.0.0.1:8000/api/applications/applications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Application submission failed");
      }
      router.push("/Submitted");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed. Please try again.");
    }
  };

  const handleSaveProgress = () => {
    const formData = getValues();
    const savedApplications: ApplicationFormData[] = JSON.parse(
      localStorage.getItem("savedApplications") ?? "[]"
    );
    const existingIndex = savedApplications.findIndex(
      (app) => app.scholarshipId === scholarshipId
    );
    if (existingIndex !== -1) {
      savedApplications[existingIndex] = formData;
    } else {
      savedApplications.push(formData);
    }
    localStorage.setItem(
      "savedApplications",
      JSON.stringify(savedApplications)
    );
    router.push("/SavedProgress");
  };

  const fields: Array<{
    label: string;
    name: keyof ApplicationFormData;
    required?: boolean;
    type?: string;
  }> = [
    { label: "Full Name", name: "fullName", required: true },
    { label: "Preferred Pronoun", name: "pronoun" },
    { label: "Student ID", name: "studentID", required: true },
    { label: "Major", name: "major", required: true },
    { label: "Minor", name: "minor" },
    { label: "Cumulative GPA", name: "gpa", required: true },
    { label: "Current Year", name: "currentYear", required: true },
    { label: "Ethnicity", name: "ethnicity", required: true },
    { label: "Work Experience", name: "workExperience" },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-[#0C234B] mb-6">
        Application Form
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        {fields.map(({ label, name, required, type }) => (
          <label key={name} className="block font-semibold">
            {label}
            {required && " *"}
            <input
              type={type ?? "text"}
              {...register(name, required ? { required: true } : {})}
              className="w-full p-2 border rounded-lg focus:ring-[#0C234B] mt-1"
            />
          </label>
        ))}

        <label className="block font-semibold">
          Personal Statement *
          <textarea
            {...register("personalStatement", { required: true })}
            className="w-full p-2 border rounded-lg mt-1"
            rows={4}
          />
        </label>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={handleSaveProgress}
          >
            Save Progress
          </button>
          <button
            type="submit"
            className="bg-[#0C234B] text-white px-4 py-2 rounded hover:bg-blue-900 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
