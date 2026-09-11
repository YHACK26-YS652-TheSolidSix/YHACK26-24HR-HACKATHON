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
        body: JSON.stringify({ name, sector, district }),
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

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    backgroundColor: "#1e293b",
    color: "white",
    border: "1px solid #334155",
    borderRadius: "10px",
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#0f172a",
        color: "white",
        borderRadius: "16px",
      }}
    >
      <h1 style={{ color: "#22c55e", fontSize: "32px", marginBottom: "10px" }}>
        Business Onboarding
      </h1>

      <p style={{ marginBottom: "20px" }}>
        Enter your business details to generate personalized compliance
        requirements.
      </p>

      <input
        type="text"
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Sector (e.g. Food Processing)"
        value={sector}
        onChange={(e) => setSector(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={createBusiness}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          cursor: "pointer",
          backgroundColor: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Creating..." : "Create Business"}
      </button>
    </main>
  );
}