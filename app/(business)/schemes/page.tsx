"use client";

import { useState } from "react";

type Recommendation = {
  id: number;
  name: string;
  description: string;
  score: number;
  reason: string;
};

export default function SchemePage() {
  const [sector, setSector] = useState("Technology");
  const [businessType, setBusinessType] = useState("Startup");
  const [isWomanOwned, setWomanOwned] = useState(false);
  const [isStartup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);

  async function fetchSchemes() {
    setLoading(true);

    const res = await fetch("/api/schemes/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sector,
        businessType,
        isWomanOwned,
        isStartup,
      }),
    });

    const data = await res.json();
    setResults(data.recommendations || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-green-400">
          AI Government Scheme Recommender
        </h1>

        <p className="text-slate-300">
          Find the best Tamil Nadu/MSME schemes for your business.
        </p>

        <div className="bg-slate-900 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Business Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3"
            >
              <option>Technology</option>
              <option>Manufacturing</option>
              <option>Agriculture</option>
              <option>Energy</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3"
            >
              <option>Startup</option>
              <option>MSME</option>
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isWomanOwned}
              onChange={() => setWomanOwned(!isWomanOwned)}
            />
            Women-Owned Business
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isStartup}
              onChange={() => setStartup(!isStartup)}
            />
            Startup Registered
          </label>
        </div>

        <button
          onClick={fetchSchemes}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
        >
          {loading ? "Finding Schemes..." : "Get AI Recommendations"}
        </button>

        {results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-green-500/30 bg-slate-900 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-green-400">
                    {item.name}
                  </h2>

                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold">
                    {item.score}% Match
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-4">
                  {item.description}
                </p>

                <div className="bg-slate-800 rounded-lg p-4 text-sm text-green-300">
                  <strong>Why Eligible?</strong>
                  <p>{item.reason}</p>
                </div>

                <button className="w-full mt-5 bg-green-500 hover:bg-green-600 rounded-lg py-2 font-medium">
                  Apply for Scheme
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}