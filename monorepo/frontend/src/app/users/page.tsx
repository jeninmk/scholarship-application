"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_locked?: boolean;
}

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState("All");
  const router = useRouter();

  const fetchUsers = () => {
    fetch("http://127.0.0.1:8000/api/accounts/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`http://127.0.0.1:8000/api/accounts/users/${userId}/`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            fetchUsers();
          } else {
            alert("Error deleting user.");
          }
        })
        .catch((error) => console.error("Delete error:", error));
    }
  };

  // Lock or unlock the user
  const handleLockUnlock = (user: User) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No auth token found. Please log in as admin.");
      return;
    }
    if (user.is_locked) {
      // Unlock the user
      fetch(`http://127.0.0.1:8000/api/accounts/unlock/${user.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            fetchUsers();
          } else {
            alert("Error unlocking user.");
          }
        })
        .catch((error) => console.error("Unlock error:", error));
    } else {
      // Lock the user
      fetch(`http://127.0.0.1:8000/api/accounts/lock/${user.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            fetchUsers();
          } else {
            alert("Error locking user.");
          }
        })
        .catch((error) => console.error("Lock error:", error));
    }
  };

  // Filter users based on selected role
  const filteredUsers =
    filterRole === "All"
      ? users
      : users.filter((user) => user.role.toLowerCase() === filterRole.toLowerCase());

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
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">User List</h2>
          <div className="mt-4 sm:mt-0">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All Roles</option>
              <option value="applicant">Applicant</option>
              <option value="reviewer">Reviewer</option>
              <option value="donor">Donor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto shadow-lg border border-gray-300 bg-white">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left border">Username</th>
                <th className="py-3 px-4 text-left border">First Name</th>
                <th className="py-3 px-4 text-left border">Last Name</th>
                <th className="py-3 px-4 text-left border">Email</th>
                <th className="py-3 px-4 text-left border">Role</th>
                <th className="py-3 px-4 text-left border">Actions</th>
                <th className="py-3 px-4 text-left border">Lock/Unlock</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border">{user.username}</td>
                  <td className="py-3 px-4 border">{user.first_name}</td>
                  <td className="py-3 px-4 border">{user.last_name}</td>
                  <td className="py-3 px-4 border">{user.email}</td>
                  <td className="py-3 px-4 border">{user.role}</td>
                  <td className="py-3 px-4 border space-x-2">
                    <button
                      className="bg-[#0C234B] text-white px-3 py-1 rounded hover:bg-blue-900 transition"
                      onClick={() => router.push(`/users/${user.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-3 px-4 border">
                    <button
                      className={`${
                        user.is_locked ? "bg-yellow-500" : "bg-red-500"
                      } text-white px-3 py-1 rounded hover:opacity-90 transition`}
                      onClick={() => handleLockUnlock(user)}
                    >
                      {user.is_locked ? "Unlock" : "Lock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserListPage;