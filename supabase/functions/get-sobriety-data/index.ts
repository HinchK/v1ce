import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const { sobrietyDate, displayName } = await req.json();
    if (!sobrietyDate) return Response.json({ error: "sobrietyDate required" }, { status: 400 });
    const start = new Date(sobrietyDate);
    const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
    const milestones = [1, 7, 30, 60, 90, 180, 365, 730, 1825].filter((m) => days >= m);
    return Response.json({ days, displayName: displayName || "", milestonesReached: milestones.length, nextMilestone: [1, 7, 30, 60, 90, 180, 365, 730, 1825].find((m) => m > days) || null });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sobriety data error" }, { status: 500 });
  }
});
