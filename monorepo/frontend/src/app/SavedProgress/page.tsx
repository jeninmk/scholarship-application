"use client";

import { useRouter } from "next/navigation";

export default function SavedProgress() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Application Progress Saved 💾
        </h2>
        <p className="text-gray-600 mb-6">
          Your application progress has been successfully saved. You can return
          to the Apply page or visit your Dashboard.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-[#0C234B] text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition"
            onClick={() => router.push("/Apply")}
          >
            Return to Apply
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            onClick={() => router.push("/Dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
