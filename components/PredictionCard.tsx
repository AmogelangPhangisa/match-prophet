"use client";
import { useState } from "react";

const CONF_STYLE: any = {
  High: "text-green-400 border-green-400 bg-green-950",
  Medium: "text-yellow-400 border-yellow-400 bg-yellow-950",
  Low: "text-red-400 border-red-400 bg-red-950",
};

function FormDots({ form }: { form: string }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {(form || "").split("").map((r, i) => (
        <span
          key={i}
          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
            r === "W" ? "bg-green-900 text-green-400" :
            r === "D" ? "bg-yellow-900 text-yellow-400" :
            "bg-red-900 text-red-400"
          }`}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

export default function PredictionCard({ fixture: f }: any) {
  const [open, setOpen] = useState(false);
  const conf = f.confidence || "Medium";
  const h = f.homeWinPct || 40;
  const d = f.drawPct || 25;
  const a = f.awayWinPct || 35;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <span className="text-xs text-gray-500">{f.date} · {f.time}</span>
        <span className={`text-xs font-bold border rounded px-2 py-0.5 ${CONF_STYLE[conf]}`}>
          {conf}
        </span>
      </div>

      <div className="p-4">
        {/* Teams */}
        <div className="grid grid-cols-3 items-center gap-2 mb-4">
          <div className="text-center">
            <div className="text-3xl mb-1">{f.homeFlag || "🏟"}</div>
            <div className="text-sm font-semibold">{f.home}</div>
            <div className="text-xs text-gray-500">Home</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{f.scoreline || "? - ?"}</div>
            <div className="text-xs text-gray-600">Predicted</div>
            {f.htScore && <div className="text-xs text-gray-600 mt-1">HT: {f.htScore}</div>}
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">{f.awayFlag || "🏟"}</div>
            <div className="text-sm font-semibold">{f.away}</div>
            <div className="text-xs text-gray-500">Away</div>
          </div>
        </div>

        {/* Win bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400">{f.home?.split(" ")[0]} {h}%</span>
            <span className="text-gray-500">Draw {d}%</span>
            <span className="text-blue-400">{f.away?.split(" ")[0]} {a}%</span>
          </div>
          <div className="flex h-2 rounded overflow-hidden gap-0.5">
            <div className="bg-green-500" style={{ width: `${h}%` }} />
            <div className="bg-gray-600" style={{ width: `${d}%` }} />
            <div className="bg-blue-500" style={{ width: `${a}%` }} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { icon: "🏆", label: "Winner", value: f.predictedWinner },
            { icon: "⚽", label: "First Goal", value: f.firstGoalTeam, sub: f.firstGoalMinute ? `~${f.firstGoalMinute}'` : null },
            { icon: "🎯", label: "Over/Under", value: f.overUnder, sub: f.totalGoals ? `exp. ${f.totalGoals}` : null },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 rounded-xl p-2 text-center">
              <div className="text-base mb-1">{s.icon}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</div>
              <div className="text-xs font-semibold text-white">{s.value}</div>
              {s.sub && <div className="text-xs text-gray-500">{s.sub}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { icon: "🚩", label: "Corners", value: f.cornersRange, sub: f.cornersTeam?.split(" ")[0] },
            { icon: "🤝", label: "BTTS", value: f.btts, color: f.btts === "Yes" ? "text-green-400" : "text-red-400" },
            { icon: "🟨", label: "Cards", value: f.cardsRange, sub: f.cardsProne?.split(" ")[0] },
          ].map((s: any) => (
            <div key={s.label} className="bg-gray-800 rounded-xl p-2 text-center">
              <div className="text-base mb-1">{s.icon}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</div>
              <div className={`text-xs font-semibold ${s.color || "text-white"}`}>{s.value}</div>
              {s.sub && <div className="text-xs text-gray-500">{s.sub}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: "⏱", label: "HT Goals", value: f.firstHalfGoals },
            { icon: "🧤", label: "Clean Sheet", value: f.cleanSheetTeam || "None" },
            { icon: "💥", label: "HT Score", value: f.htScore || "?" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 rounded-xl p-2 text-center">
              <div className="text-base mb-1">{s.icon}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</div>
              <div className="text-xs font-semibold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-700 hover:border-green-500 text-gray-500 hover:text-green-400 rounded-xl py-2 text-xs transition-all"
        >
          {open ? "▲ Hide Analysis" : "▼ Full Analysis + Form"}
        </button>

        {/* Expanded */}
        {open && (
          <div className="mt-3 space-y-3">
            {f.keyPlayer && (
              <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-3 flex gap-3 items-start">
                <span className="text-lg">⭐</span>
                <div>
                  <div className="text-xs text-yellow-400 font-semibold">{f.keyPlayer}</div>
                  <div className="text-xs text-gray-400 mt-1">{f.keyPlayerReason}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Shots on Target", value: f.shotsOnTarget },
                { label: "Possession", value: f.possession },
                { label: "Fouls Expected", value: f.fouls },
                { label: "Offsides", value: f.offsides },
              ].filter(s => s.value).map(s => (
                <div key={s.label} className="bg-gray-800 rounded-xl p-2">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-xs font-semibold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            {f.analysis && (
              <div className="border-l-2 border-green-500 pl-3 bg-gray-800 rounded-r-xl p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tactical Analysis</div>
                <p className="text-xs text-gray-300 leading-relaxed">{f.analysis}</p>
              </div>
            )}

            {(f.homeForm || f.awayForm) && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-2">{f.home?.split(" ")[0]} form</div>
                  <FormDots form={f.homeForm} />
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-2">{f.away?.split(" ")[0]} form</div>
                  <FormDots form={f.awayForm} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}