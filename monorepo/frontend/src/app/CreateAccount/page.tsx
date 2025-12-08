// src/app/CreateAccount/page.tsx

"use client";

import { useRouter } from "next/navigation";
import CreateAccountForm from "@/components/forms/CreateAccountForm";
import { Button } from "@/components/ui/button";

export default function CreateAccountPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* Left Section - Create Account Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>
          <CreateAccountForm />
        </div>
      </div>

      {/* Right Section - Login Prompt with Tie-Dye Background */}
      <div
        className="w-1/3 flex flex-col justify-center items-center p-8 text-white"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, #3b82f6, transparent),
            radial-gradient(circle at 80% 80%, #2563eb, transparent),
            radial-gradient(circle at 50% 50%, #1e40af, transparent)
          `,
          backgroundSize: "cover",
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Already have an account?
        </h2>
        <p className="text-lg text-center mb-6">Welcome back!</p>
        <Button
          onClick={() => router.push("/tempLogin")}
          className="bg-white text-blue-600 hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg transition"
        >
          Login
        </Button>
      </div>
    </div>
  );
}











  
  