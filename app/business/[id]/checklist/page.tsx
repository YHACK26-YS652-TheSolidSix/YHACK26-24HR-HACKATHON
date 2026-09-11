"use client";

import { useEffect, useState } from "react";

type ChecklistItem = {
  id: string;
  requirementCode: string;
  name: string;
  department: string;
  status: string;
};

export default function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [checklist, setChecklist] = useState<{
    checklistId: string;
    items: ChecklistItem[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChecklist() {
      try {
        const { id } = await params;

        // First try to get an existing checklist
        let response = await fetch(
          `/api/business/${id}/checklist`
        );

        let data = await response.json();

        // If checklist does not exist, generate it
        if (response.status === 404) {
          response = await fetch(
            `/api/business/${id}/checklist/generate`,
            {
              method: "POST",
            }
          );

          data = await response.json();
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load checklist"
          );
        }

        setChecklist(data);
      } catch (error) {
        console.error("Checklist loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadChecklist();
  }, [params]);

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>Generating your checklist...</h1>
        <p>
          We are preparing the compliance requirements for
          your business.
        </p>
      </main>
    );
  }

  if (!checklist) {
    return (
      <main
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>Unable to load checklist</h1>
        <p>
          Something went wrong while loading your compliance
          requirements.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Personalized Compliance Checklist</h1>

      <p>
        Based on your business profile, these are the
        compliance requirements you need to complete.
      </p>

      {checklist.items.length === 0 ? (
        <p>
          No compliance requirements were found for this
          business.
        </p>
      ) : (
        checklist.items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              margin: "15px 0",
              backgroundColor: "#fff",
            }}
          >
            <h2>{item.name}</h2>

            <p>
              <strong>Requirement:</strong>{" "}
              {item.requirementCode}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {item.department}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {item.status}
            </p>
          </div>
        ))
      )}
    </main>
  );
}