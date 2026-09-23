import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Invalid email" }, { status: 400 });
    const giveawayMonth = new Date().toISOString().slice(0, 7);
    const { data: existing } = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/giveaway_entries?select=id&email=eq.${encodeURIComponent(email)}&giveaway_month=eq.${giveawayMonth}`,
      { headers: { apikey: Deno.env.get("SUPABASE_ANON_KEY") || "", Authorization: req.headers.get("Authorization") || "" } }
    ).then(r => r.json().catch(() => []));
    if (Array.isArray(existing) && existing.length > 0) return Response.json({ success: false, message: "already_entered" });
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/giveaway_entries`, {
      method: "POST",
      headers: { apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ email, giveaway_month: giveawayMonth, is_winner: false })
    });
    if (!response.ok) return Response.json({ error: await response.text() }, { status: 500 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Giveaway error" }, { status: 500 });
  }
});