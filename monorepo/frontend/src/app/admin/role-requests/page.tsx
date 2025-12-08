"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserRoleRequest {
  id: number;
  username: string;
  email: string;
  role: string;
  requested_role: string;
}

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState<UserRoleRequest[]>([]);
  const [filterRole, setFilterRole] = useState("All");
  const router = useRouter();

  const fetchRequests = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/role-requests/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => setRequests(response.data))
      .catch((error) => console.error("Error fetching role requests", error));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRole = (userId: number, newRole: string, approved: boolean) => {
    const token = localStorage.getItem("authToken");
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/role-update/${userId}/`,
        {
          role: newRole,
          role_approved: approved,
          requested_role: "", // Clear requested_role after update
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        setRequests((prev) => prev.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error("Error updating role", error));
  };

  const filteredRequests =
    filterRole === "All"
      ? requests
      : requests.filter(
          (user) => user.requested_role.toLowerCase() === filterRole.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Neutral Bar */}
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
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pending Role Requests</h2>
          <div className="mt-4 sm:mt-0">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All Requested Roles</option>
              <option value="applicant">Applicant</option>
              <option value="reviewer">Reviewer</option>
              <option value="donor">Donor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {filteredRequests.length === 0 ? (
          <p className="text-center">No pending role requests.</p>
        ) : (
          <div className="overflow-x-auto shadow-lg border border-gray-300 bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left border">Username</th>
                  <th className="py-3 px-4 text-left border">Current Role</th>
                  <th className="py-3 px-4 text-left border">Requested Role</th>
                  <th className="py-3 px-4 text-left border">Email</th>
                  <th className="py-3 px-4 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border">{user.username}</td>
                    <td className="py-3 px-4 border">{user.role}</td>
                    <td className="py-3 px-4 border">{user.requested_role}</td>
                    <td className="py-3 px-4 border">{user.email}</td>
                    <td className="py-3 px-4 border space-x-2">
                      <button
                        onClick={() =>
                          updateRole(user.id, user.requested_role, true)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRole(user.id, user.role, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}