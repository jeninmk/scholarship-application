"use client";

import ApplicationForm from "@/components/forms/ApplicationForm";
import { useSearchParams } from "next/navigation";

export default function Application() {
  const searchParams = useSearchParams();
  const scholarshipId = searchParams.get("scholarshipId") || ""; // Default to empty string if null

  return (
    <main className="flex-1 p-6 flex justify-center">
      <ApplicationForm scholarshipId={scholarshipId} />
    </main>
  );
}
