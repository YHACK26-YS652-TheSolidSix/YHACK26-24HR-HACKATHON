"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  if (!user) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Compliance Copilot</h1>
            <p>Business Compliance Dashboard</p>
          </div>

          <button
            onClick={() => {
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </header>

        <section className="welcome-card">
          <h2>Welcome, {user.name}! 👋</h2>
          <p>
            Manage your business compliance requirements from one place.
          </p>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📋 Compliance Checklist</h3>
            <p>
              View and track all compliance requirements for your business.
            </p>
            <button onClick={() => (window.location.href = "/checklist")}>
              View Checklist
            </button>
          </div>

          <div className="dashboard-card">
            <h3>📄 Documents</h3>
            <p>
              Upload, manage and validate your compliance documents.
            </p>
            <button>Manage Documents</button>
          </div>

          <div className="dashboard-card">
            <h3>📝 Applications</h3>
            <p>
              Track submitted applications and their current status.
            </p>
            <button>View Applications</button>
          </div>

          <div className="dashboard-card">
            <h3>⚠️ Grievances</h3>
            <p>
              Submit and track compliance-related grievances.
            </p>
            <button>View Grievances</button>
          </div>

          <div className="dashboard-card">
            <h3>💰 Government Schemes</h3>
            <p>
              Discover schemes and check your business eligibility.
            </p>
            <button>Explore Schemes</button>
          </div>

          <div className="dashboard-card">
            <h3>👤 Profile</h3>
            <p>
              View and manage your business account information.
            </p>
            <button>View Profile</button>
          </div>
        </section>

        <section className="account-info">
          <h2>Account Information</h2>

          <div>
            <strong>Name:</strong> {user.name}
          </div>

          <div>
            <strong>Email:</strong> {user.email}
          </div>

          <div>
            <strong>Role:</strong> {user.role}
          </div>
        </section>
      </div>
    </main>
  );
}