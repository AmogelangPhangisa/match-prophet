export default function SummaryBar({ predictions }: any) {
  const high = predictions.filter((p: any) => p.confidence === "High").length;
  const btts = predictions.filter((p: any) => p.btts === "Yes").length;
  const over = predictions.filter((p: any) => (p.overUnder || "").includes("Over")).length;

  return (
    <div className="flex justify-center gap-6 bg-gray-900 rounded-xl p-4">
      {[
        { label: "Fixtures", value: predictions.length },
        { label: "High Confidence", value: high },
        { label: "BTTS Yes", value: btts },
        { label: "Over 2.5", value: over },
      ].map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl font-bold text-green-400">{s.value}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</div>
        </div>
      ))}
    </div>
  );
}