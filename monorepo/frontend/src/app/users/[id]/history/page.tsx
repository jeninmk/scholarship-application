"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface ChangeHistory {
  field_name: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  timestamp: string;
}

const UserHistory = () => {
  const params = useParams();
  const id = params?.id as string;
  const [history, setHistory] = useState<ChangeHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/accounts/users/${id}/history/`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Change History</h1>
      <ul>
        {history.map((change) => {
          const key = `${change.timestamp}-${change.field_name}-${change.changed_by}`;
          return (
            <li key={key}>
              {change.timestamp}: {change.field_name} changed from{" "}
              {change.old_value} to {change.new_value} by {change.changed_by}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserHistory;
