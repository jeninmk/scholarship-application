"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.access);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", username);

      if (
        data.role.toLowerCase() === "donor" &&
        username.toLowerCase() === "donor1"
      ) {
        localStorage.setItem("donorId", "2");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Red Bar */}
      <header className="bg-[#AB0520] text-white py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Left side: UA Logo and UASAMS */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/ua-logo.png"
              alt="UA Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-lg font-bold">UASAMS</h1>
          </div>
          {/* Right side: Navigation */}
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

      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/aerial.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            University of Arizona Scholarship Application Management System
          </h2>
          <p className="text-lg md:text-xl mb-4 max-w-2xl">
            Welcome to the website, Wildcat! Are you ready to apply for
            scholarships?
          </p>
          <a
            href="#login-form"
            className="bg-[#0C234B] hover:bg-blue-900 px-6 py-3 rounded text-white font-semibold transition"
          >
            Sign In
          </a>
        </div>
      </section>

      {/* Login Form Section */}
      <section
        id="login-form"
        className="bg-white py-10 px-4 flex justify-center"
      >
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#0C234B] text-center mb-6">
            Sign In
          </h2>
          {error && (
            <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#0C234B] text-white py-3 rounded-md hover:bg-blue-900 transition-colors"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <a
              href="/create-account"
              className="inline-block mt-2 bg-[#AB0520] text-white py-2 px-6 rounded hover:bg-red-800 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
