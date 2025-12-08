"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Scrolls smoothly to the login form
  const scrollToForm = () => {
    const el = document.getElementById("login-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials check
    if (username.toLowerCase() === "luis soto" && password === "password") {
      localStorage.setItem("authToken", "dummy-token");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        {/* Hero text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            University of Arizona Scholarship Application Management System
          </h2>
          <p className="text-lg md:text-xl mb-4 max-w-2xl">
            Welcome to the website, Wildcat! Are you ready to apply for
            scholarships?
          </p>
          {/* Scroll down button */}
          <button
            type="button"
            onClick={scrollToForm}
            className="bg-[#0C234B] hover:bg-blue-900 px-6 py-3 rounded text-white font-semibold transition"
          >
            Sign In
          </button>
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
