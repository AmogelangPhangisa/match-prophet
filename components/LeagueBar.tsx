export default function LeagueBar({ leagues, active, onSelect }: any) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {leagues.map((lg: any) => (
        <button
          key={lg.id}
          onClick={() => onSelect(lg)}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
            active.id === lg.id
              ? "bg-green-500 text-black border-green-500"
              : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
          }`}
        >
          {lg.flag} {lg.label}
        </button>
      ))}
    </div>
  );
}