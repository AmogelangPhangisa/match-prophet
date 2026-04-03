const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function getPredictions(fixtures: any[], standings: any) {
  const prompt = `You are an elite football analyst with access to real current data.

CURRENT LEAGUE STANDINGS (top 10):
${standings ? JSON.stringify(standings, null, 2) : "Not available"}

UPCOMING FIXTURES WITH REAL DATA:
${JSON.stringify(fixtures.map(f => ({
  match: `${f.home} vs ${f.away}`,
  date: f.date,
  time: f.time,
  last5HomeMatches: f.homeForm,
  last5AwayMatches: f.awayForm,
  last5HeadToHead: f.h2h,
})), null, 2)}

Based on this REAL current data — standings, recent form, and head to head history — predict each fixture.

Return ONLY a raw JSON array, no markdown, no explanation. For each fixture:
{
  "home": "team name",
  "away": "team name",
  "predictedWinner": "team name or Draw",
  "scoreline": "2-1",
  "htScore": "1-0",
  "homeWinPct": 45,
  "drawPct": 25,
  "awayWinPct": 30,
  "firstGoalTeam": "team name",
  "firstGoalMinute": "23",
  "btts": "Yes or No",
  "overUnder": "Over 2.5 or Under 2.5",
  "totalGoals": "2.8",
  "cornersRange": "9-11",
  "cornersTeam": "team name",
  "cardsRange": "3-5",
  "cardsProne": "player or team name",
  "firstHalfGoals": "1-2",
  "cleanSheetTeam": "team name or None",
  "keyPlayer": "Full player name",
  "keyPlayerReason": "one line reason",
  "shotsOnTarget": "Home 5 - Away 3",
  "possession": "Home 55% - Away 45%",
  "fouls": "22-26 expected",
  "offsides": "3-5 total",
  "homeForm": "WWDLW",
  "awayForm": "LDWWL",
  "confidence": "High or Medium or Low",
  "analysis": "3 sentence tactical analysis referencing actual form and H2H data"
}`;

  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    }),
  });

  if (!res.ok) {
    const errText = await res.json();
    throw new Error(`Gemini failed: ${JSON.stringify(errText)}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);
  return JSON.parse(match ? match[0] : clean);
}