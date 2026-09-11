"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  async function createBusiness() {
    if (!name || !sector || !district) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sector,
          district,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create business");
        return;
      }

      router.push(`/business/${data.id}/checklist`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
      }}
    >
      <h1>Business Onboarding</h1>

      <p>
        Enter your business details to generate personalized
        compliance requirements.
      </p>

      <input
        type="text"
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
        }}
      />

      <input
        type="text"
        placeholder="Sector e.g. Food Processing"
        value={sector}
        onChange={(e) => setSector(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
        }}
      />

      <input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
        }}
      />

      <button
        onClick={createBusiness}
        disabled={loading}
        style={{
          padding: "12px 25px",
          marginTop: "15px",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Business"}
      </button>
    </main>
  );
}