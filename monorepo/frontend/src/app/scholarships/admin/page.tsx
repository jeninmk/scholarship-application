"use client";
import { useState, useEffect } from "react";

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [token, setToken] = useState(""); // Admin token

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/scholarships/")
      .then((res) => res.json())
      .then((data) => setScholarships(data))
      .catch((error) => console.error("Error fetching scholarships:", error));
  }, []);

  const handleDelete = async (id: number) => { // Explicitly set type to number
    if (!token) {
      alert("You must be logged in as an admin.");
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/api/scholarships/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setScholarships(scholarships.filter((s) => s.id !== id));
    } else {
      alert("Failed to delete. Ensure you are an admin.");
    }
  };

  return (
    <div>
      <h1>Admin Panel - Manage Scholarships</h1>
      
      <input
        type="text"
        placeholder="Admin Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <ul>
        {scholarships.map((s) => (
          <li key={s.id}>
            {s.name} - ${s.amount}
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
