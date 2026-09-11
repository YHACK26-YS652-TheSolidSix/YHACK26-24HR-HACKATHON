"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Analytics = {
  stats: {
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    rejectedApplications: number;
  };
  monthlyApplications: { month: string; applications: number }[];
  sectorDistribution: { sector: string; value: number }[];
  topSchemes: { name: string; applications: number }[];
};

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Analytics...</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-green-400">
            Business Analytics Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Insights into government scheme applications and business growth.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Applications" value={data.stats.totalApplications} />
          <StatCard title="Approved" value={data.stats.approvedApplications} />
          <StatCard title="Pending" value={data.stats.pendingApplications} />
          <StatCard title="Rejected" value={data.stats.rejectedApplications} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 h-[380px]">
            <h2 className="text-xl font-semibold text-green-300 mb-4">
              Monthly Applications
            </h2>

            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data.monthlyApplications}>
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="applications" fill="#22c55e" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 h-[380px]">
            <h2 className="text-xl font-semibold text-green-300 mb-4">
              Sector Distribution
            </h2>

            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data.sectorDistribution}
                  dataKey="value"
                  nameKey="sector"
                  outerRadius={110}
                  label
                >
                  {data.sectorDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-5">
            Top Applied Government Schemes
          </h2>

          <div className="space-y-4">
            {data.topSchemes.map((scheme) => (
              <div
                key={scheme.name}
                className="bg-slate-800 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{scheme.name}</p>
                  <p className="text-sm text-slate-400">
                    Total Applications Received
                  </p>
                </div>

                <div className="text-green-400 text-2xl font-bold">
                  {scheme.applications}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-green-500/20">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-green-400 mt-2">{value}</h2>
    </div>
  );
}