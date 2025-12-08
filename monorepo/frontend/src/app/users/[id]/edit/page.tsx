"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
}

const UserEdit = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/accounts/users/${id}/`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setError("Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/api/accounts/users/${id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Update failed");
      setSuccess("User updated successfully!");
      setError("");
    } catch (err) {
      setError("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!user) return <p className="text-center mt-8">User not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Red Bar */}
      <header className="bg-gradient-to-r from-[#AB0520] to-[#9B051F] text-white py-3 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/ua-logo.png" alt="UA Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold">UASAMS</h1>
          </div>
          <nav>
            <button
              className="bg-white text-[#AB0520] px-3 py-1 rounded hover:bg-gray-200 transition"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit User</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <table className="min-w-full bg-white border border-gray-300 shadow-lg">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-semibold">Username</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Email</td>
                <td className="p-3">
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">First Name</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={user.first_name}
                    onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Last Name</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={user.last_name}
                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Phone</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={user.phone || ""}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Role</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="applicant">Applicant</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="donor">Donor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-[#0C234B] text-white py-2 rounded hover:bg-blue-900 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserEdit;