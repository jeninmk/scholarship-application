"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

const UserDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Get the `id` from the URL params
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/accounts/users/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // For authentication cookies if needed
          }
        );

        if (!response.ok) throw new Error("User not found");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Phone: {user.phone || "N/A"}</p>
      <button onClick={() => router.push("/users")}>Back to Users</button>
    </div>
  );
};

export default UserDetail;
