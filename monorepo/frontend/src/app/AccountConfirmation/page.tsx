"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AccountConfirmation() {
  const router = useRouter(); // Initialize Next.js router

  const handleLoginRedirect = () => {
    router.push("/tempLogin"); // Update this path when your teammate completes the login page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Account Created Successfully!
        </h2>
        <p className="text-center text-gray-600">
          Your account has been created. You can now log in.
        </p>

        {/* Login Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleLoginRedirect}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
