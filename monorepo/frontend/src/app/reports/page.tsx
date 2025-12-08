"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username") || "";
    let r = "applicant";
    const lower = stored.toLowerCase();
    if (lower.includes("admin")) r = "admin";
    else if (lower.includes("donor")) r = "donor";
    else if (lower.includes("reviewer")) r = "reviewer";
    setRole(r);
  }, []);

  if (!role) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  const options = [
    { key: "available", label: "Available Scholarships" },
    role !== "applicant" && { key: "archived", label: "Archived Scholarships" },
    role !== "applicant" && {
      key: "applicants",
      label: "Scholarship Applicants",
    },
    role === "admin" && { key: "awarded", label: "Awarded Scholarships" },
    role === "admin" && { key: "demographics", label: "Student Demographics" },
    { key: "active-donors", label: "Active Donors" },
  ].filter(Boolean) as { key: string; label: string }[];

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReport = (key: string) => {
    let header = "";
    let rows: string[] = [];
    let filename = `${key}_report.csv`;

    switch (key) {
      case "available":
        header = [
          "Name",
          "Amount",
          "Donor",
          "Phone",
          "Email",
          "Quantity",
          "Majors",
          "Min GPA",
          "Deadline",
          "Requirements",
          "Description",
        ].join(",");
        rows = [
          [
            "Engineering Excellence",
            "5000",
            "John Doe",
            "123-456-7890",
            "john@example.com",
            "5",
            "CS;ME",
            "3.5",
            "2025-12-31",
            "Maintain full-time status",
            "Supports innovative projects",
          ].join(","),
          [
            "Art & Design",
            "3000",
            "Jane Smith",
            "987-654-3210",
            "jane@example.com",
            "3",
            "Art",
            "3.0",
            "2025-11-15",
            "Portfolio required",
            "Encourages creative exploration",
          ].join(","),
        ];
        break;
      case "archived":
        header = [
          "Name",
          "Amount",
          "Donor",
          "Phone",
          "Email",
          "Quantity",
          "Majors",
          "Min GPA",
          "Deadline",
          "Requirements",
          "Description",
          "Archived Date",
        ].join(",");
        rows = [
          [
            "Legacy Scholars",
            "2000",
            "Alice Brown",
            "555-222-3333",
            "alice@example.com",
            "2",
            "History",
            "2.5",
            "2024-06-30",
            "Essay required",
            "Honoring past achievements",
            "2024-07-01",
          ].join(","),
        ];
        break;
      case "applicants":
        header = [
          "Full Name",
          "Pronoun",
          "Student ID",
          "Major",
          "Minor",
          "GPA",
          "Year",
          "Ethnicity",
          "Email",
          "Statement",
          "Experience",
        ].join(",");
        rows = [
          [
            "Bob Johnson",
            "he/him",
            "S1001",
            "CS",
            "Math",
            "3.8",
            "Junior",
            "Hispanic",
            "bob.j@example.com",
            "Passionate about AI",
            "Research intern",
          ].join(","),
        ];
        break;
      case "awarded":
        header = [
          "Scholarship",
          "Amount",
          "Awardee",
          "NetID",
          "Major",
          "GPA",
          "Ethnicity",
          "Email",
          "Award Date",
        ].join(",");
        rows = [
          [
            "Engineering Excellence",
            "5000",
            "Carol Lee",
            "cl789",
            "ME",
            "3.9",
            "Asian",
            "carol.lee@example.com",
            "2025-01-15",
          ].join(","),
        ];
        break;
      case "demographics":
        header = [
          "Full Name",
          "Pronoun",
          "Student ID",
          "Major",
          "Minor",
          "GPA",
          "Year",
          "Ethnicity",
          "Email",
        ].join(",");
        rows = [
          [
            "David Kim",
            "they",
            "S2002",
            "Biology",
            "Chemistry",
            "3.7",
            "Senior",
            "Asian",
            "david.kim@example.com",
          ].join(","),
        ];
        break;
      case "active-donors":
        header = [
          "Donor",
          "Phone",
          "Email",
          "Scholarship",
          "Amount",
          "Quantity",
          "Majors",
          "Min GPA",
          "Deadline",
        ].join(",");
        rows = [
          [
            "Evelyn Clark",
            "444-555-6666",
            "evelyn@example.com",
            "STEM Innovators",
            "4000",
            "4",
            "STEM",
            "3.2",
            "2025-09-01",
          ].join(","),
        ];
        break;
      default:
        return;
    }

    const csvContent = [header, ...rows].join("\n");
    downloadCSV(filename, csvContent);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Red Bar */}
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
            <button
              className="relative p-1 hover:text-gray-200 transition"
              onClick={() => router.push("/notifications")}
            >
              <Bell size={24} />
              <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => {
                localStorage.clear();
                router.push("/");
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Generate Reports</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-4xl">
          {options.map((opt) => (
            <button
              key={opt.key}
              className="bg-[#0C234B] text-white py-4 px-6 rounded-2xl hover:bg-blue-900 transition text-lg font-medium"
              onClick={() => handleReport(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
