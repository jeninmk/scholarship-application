"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  net_id: string;
  security_question1: string;
  security_answer1: string;
  security_question2: string;
  security_answer2: string;
  requested_role: string;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    net_id: "",
    security_question1: "",
    security_answer1: "",
    security_question2: "",
    security_answer2: "",
    requested_role: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Account creation failed");
      }
      setMessage(
        "Account created successfully! Please wait for admin approval if a role change was requested."
      );
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Step 1: Personal Details
            </h2>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Contact Information
            </h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Step 3: Account Credentials
            </h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Step 4: Security Questions
            </h2>
            <input
              type="text"
              name="security_question1"
              placeholder="Security Question 1"
              value={formData.security_question1}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="security_answer1"
              placeholder="Security Answer 1"
              value={formData.security_answer1}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="security_question2"
              placeholder="Security Question 2"
              value={formData.security_question2}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="security_answer2"
              placeholder="Security Answer 2"
              value={formData.security_answer2}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <select
              name="requested_role"
              value={formData.requested_role}
              onChange={handleChange}
              className="border p-2 w-full mb-4"
            >
              <option value="">Select desired role (optional)</option>
              <option value="reviewer">Reviewer</option>
              <option value="donor">Donor</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            <div className="flex items-center space-x-2">
              <select
                className="text-black px-2 py-1 rounded"
                defaultValue="I am"
              >
                <option>I am</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Alumni</option>
              </select>
              <button
                type="button"
                className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Go
              </button>
            </div>
            <button type="button" className="hover:underline">
              Visit
            </button>
            <button type="button" className="hover:underline">
              Apply
            </button>
            <button type="button" className="hover:underline">
              Give
            </button>
            <button type="button" className="hover:underline">
              Resources
            </button>
          </nav>
        </div>
      </header>

      <main
        className="relative flex-1 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/aerial.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg m-4">
          <h1 className="text-2xl font-bold mb-6 text-center">
            University of Arizona Scholarship Application Center
          </h1>
          <form
            onSubmit={
              step === 4
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    nextStep();
                  }
            }
            className="space-y-4"
          >
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              {step < 4 && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              )}
              {step === 4 && (
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          {message && (
            <p className="mt-4 text-green-500 text-center">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
