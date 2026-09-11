"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUSINESS");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Registration failed");
        return;
      }

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Compliance Copilot</h1>
        <p className="login-subtitle">Create your account</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="BUSINESS">Business</option>
            <option value="OFFICER">Officer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="register-link">
          Already have an account?{" "}
          <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}