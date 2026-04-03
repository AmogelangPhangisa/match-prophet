const BASE_URL = "https://api.football-data.org/v4";

const LEAGUE_CODES: Record<string, string> = {
  epl: "PL",
  la_liga: "PD",
  serie_a: "SA",
  bundesliga: "BL1",
  ligue_1: "FL1",
  champions_league: "CL",
};

function getFlag(country: string): string {
  const flags: Record<string, string> = {
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Spain: "🇪🇸",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    France: "🇫🇷",
    Portugal: "🇵🇹",
    Netherlands: "🇳🇱",
    Brazil: "🇧🇷",
    Argentina: "🇦🇷",
  };
  return flags[country] || "🏟";
}

const HEADERS = { "X-Auth-Token": process.env.FOOTBALL_API_KEY! };

export async function getUpcomingFixtures(leagueId: string) {
  const code = LEAGUE_CODES[leagueId];

  const res = await fetch(`${BASE_URL}/competitions/${code}/matches?status=SCHEDULED`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error("Failed to fetch fixtures");
  const data = await res.json();

  return data.matches.slice(0, 3).map((m: any) => ({
    id: m.id,
    home: m.homeTeam.name,
    away: m.awayTeam.name,
    homeId: m.homeTeam.id,
    awayId: m.awayTeam.id,
    date: new Date(m.utcDate).toDateString(),
    time: new Date(m.utcDate).toUTCString().slice(17, 22) + " UTC",
    homeFlag: getFlag(m.homeTeam.area?.name),
    awayFlag: getFlag(m.awayTeam.area?.name),
  }));
}

export async function getStandings(leagueId: string) {
  const code = LEAGUE_CODES[leagueId];
  if (code === "CL") return null;
  const res = await fetch(`${BASE_URL}/competitions/${code}/standings`, {
    headers: HEADERS,
  });
  if (!res.ok) return null;
  const data = await res.json();
  const table = data.standings?.[0]?.table || [];
  return table.slice(0, 10).map((t: any) => ({
    position: t.position,
    team: t.team.name,
    played: t.playedGames,
    won: t.won,
    drawn: t.draw,
    lost: t.lost,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    points: t.points,
    form: t.form,
  }));
}

export async function getH2H(matchId: number) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/head2head?limit=5`, {
    headers: HEADERS,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.matches || []).slice(0, 5).map((m: any) => ({
    date: new Date(m.utcDate).toDateString(),
    home: m.homeTeam.name,
    away: m.awayTeam.name,
    homeScore: m.score?.fullTime?.home,
    awayScore: m.score?.fullTime?.away,
    winner: m.score?.winner,
  }));
}

export async function getTeamForm(teamId: number) {
  const res = await fetch(`${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=5`, {
    headers: HEADERS,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.matches || []).slice(0, 5).map((m: any) => ({
    date: new Date(m.utcDate).toDateString(),
    home: m.homeTeam.name,
    away: m.awayTeam.name,
    homeScore: m.score?.fullTime?.home,
    awayScore: m.score?.fullTime?.away,
    winner: m.score?.winner,
    teamId,
  }));
}