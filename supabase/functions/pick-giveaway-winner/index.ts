import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const month = new Date().toISOString().slice(0, 7);
    const entries = await fetch(
      `${supabaseUrl}/rest/v1/giveaway_entries?giveaway_month=eq.${month}&is_winner=eq.false&select=*`,
      { headers: { apikey: serviceKey || "", Authorization: `Bearer ${serviceKey}` } }
    ).then((r) => r.json());
    if (!Array.isArray(entries) || entries.length === 0) return Response.json({ error: "No entries this month" }, { status: 404 });
    const winner = entries[Math.floor(Math.random() * entries.length)];
    await fetch(`${supabaseUrl}/rest/v1/giveaway_entries?id=eq.${winner.id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey || "",
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ is_winner: true }),
    });
    return Response.json({ success: true, winnerEmail: winner.email });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Giveaway pick error" }, { status: 500 });
  }
});
