"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  businessId: string;
  checklistItemId: string;
  status: string;
  riskScore: number;
  createdAt: string;
  checklistItem: {
    id: string;
    status: string;
  };
};

// Temporary hardcoded businessId until login/session wiring exists.
// Replace with the real logged-in business's id once Member 1's auth
// context is available.
const TEMP_BUSINESS_ID = "cmtw60cz20003v66467532ow6";

const STATUS_COLORS: Record<string, string> = {
  submitted: "#f59e0b",
  under_review: "#3b82f6",
  info_requested: "#a855f7",
  approved: "#22c55e",
  rejected: "#ef4444",
};

export default function ApplicationsTimeline() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/applications?businessId=cmtwjep190003tlb8o6kh42il")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setApplications(data);
        }
      })
      .catch(() => setError("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Loading applications...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Applications Timeline
      </h1>

      {applications.length === 0 && <p>No applications yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>Application {app.id.slice(0, 8)}</p>
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                Created {new Date(app.createdAt).toLocaleString()}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Risk: {app.riskScore}
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: STATUS_COLORS[app.status] ?? "#9ca3af",
                }}
              >
                {app.status.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}