import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MILESTONES = [30, 60, 90, 120, 180, 365];

Deno.serve(async (req: Request) => {
  try {
    const { sobrietyDate, email, displayName } = await req.json();
    if (!sobrietyDate) return Response.json({ error: "sobrietyDate required" }, { status: 400 });
    const days = Math.max(0, Math.floor((Date.now() - new Date(sobrietyDate).getTime()) / 86400000));
    const hit = MILESTONES.includes(days);
    return Response.json({
      days,
      milestone: hit ? days : null,
      shouldNotify: hit,
      email: email || null,
      displayName: displayName || "",
      message: hit ? `${displayName || "A V1CE member"} reached ${days} days sober.` : "No milestone today.",
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Milestone check error" }, { status: 500 });
  }
});
