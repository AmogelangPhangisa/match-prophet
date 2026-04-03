"use client";

import { useState } from "react";
import LeagueBar from "@/components/LeagueBar";
import SummaryBar from "@/components/SummaryBar";
import PredictionCard from "@/components/PredictionCard";

const LEAGUES = [
  { id: "epl", label: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "la_liga", label: "La Liga", flag: "🇪🇸" },
  { id: "serie_a", label: "Serie A", flag: "🇮🇹" },
  { id: "bundesliga", label: "Bundesliga", flag: "🇩🇪" },
  { id: "ligue_1", label: "Ligue 1", flag: "🇫🇷" },
  { id: "champions_league", label: "Champions League", flag: "🏆" },
];

export default function Home() {
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<string | null>(null);

  async function handlePredict() {
    setLoading(true);
    setError(null);
    setPredictions([]);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueId: activeLeague.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setPredictions(data.predictions);
      setUpdated(new Date().toLocaleTimeString());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="text-center py-10 px-4 border-b border-gray-800">
        <p className="text-green-400 text-xs tracking-widest uppercase mb-2">AI Match Intelligence</p>
        <h1 className="text-5xl font-bold tracking-tight mb-2">Match Prophet</h1>
        <p className="text-gray-500 text-sm mb-6">
          Winner · Score · First Goal · Corners · BTTS · Cards · Form
        </p>
        <LeagueBar
          leagues={LEAGUES}
          active={activeLeague}
          onSelect={(lg: any) => { setActiveLeague(lg); setPredictions([]); }}
        />
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold rounded-xl transition-all"
        >
          {loading ? "Analysing..." : `⚡ Predict ${activeLeague.label}`}
        </button>
        {updated && !loading && (
          <p className="text-gray-600 text-xs mt-2">Updated {updated}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-400 rounded-xl p-4 text-sm mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-xs tracking-widest">CRUNCHING DATA...</p>
          </div>
        )}

        {predictions.length > 0 && !loading && (
          <>
            <SummaryBar predictions={predictions} />
            <div className="flex flex-col gap-4 mt-4">
              {predictions.map((p, i) => (
                <PredictionCard key={i} fixture={p} />
              ))}
            </div>
            <p className="text-center text-gray-700 text-xs mt-8">
              AI predictions for entertainment only. Not betting advice.by Amogelang Phangisa
            </p>
          </>
        )}

        {!loading && predictions.length === 0 && !error && (
          <div className="text-center py-24 text-gray-800">
            <div className="text-6xl mb-4">⚽</div>
            <p className="tracking-widest text-sm">SELECT A LEAGUE AND PREDICT</p>
          </div>
        )}
      </div>
    </main>
  );
}