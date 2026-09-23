import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const sobrietyDate = url.searchParams.get("sobrietyDate");
    const name = url.searchParams.get("name") || "";
    if (!sobrietyDate) return Response.json({ error: "sobrietyDate parameter required" }, { status: 400 });
    const start = new Date(sobrietyDate);
    const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
    return Response.json({ days, name }, { headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Stats error" }, { status: 500 });
  }
});
