import { NextRequest, NextResponse } from "next/server";
import { getUpcomingFixtures, getStandings, getH2H, getTeamForm } from "@/lib/football";
import { getPredictions } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { leagueId } = await req.json();

    if (!leagueId) {
      return NextResponse.json({ error: "League ID required" }, { status: 400 });
    }

    // Get fixtures
    const fixtures = await getUpcomingFixtures(leagueId);
    if (!fixtures.length) {
      return NextResponse.json({ error: "No upcoming fixtures found" }, { status: 404 });
    }

    // Get standings
    const standings = await getStandings(leagueId);

    // Get H2H and form for each fixture in parallel
    const enriched = await Promise.all(
      fixtures.map(async (f: any) => {
        const [h2h, homeForm, awayForm] = await Promise.all([
          getH2H(f.id),
          getTeamForm(f.homeId),
          getTeamForm(f.awayId),
        ]);
        return { ...f, h2h, homeForm, awayForm };
      })
    );

    // Send everything to Gemini
    const predictions = await getPredictions(enriched, standings);

    const merged = predictions.map((pred: any, i: number) => ({
      ...fixtures[i],
      ...pred,
    }));

    return NextResponse.json({ predictions: merged });

  } catch (error: any) {
    console.error("Predict error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}