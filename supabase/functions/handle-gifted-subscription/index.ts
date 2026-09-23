import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const gifterEmail = payload?.gifter_email || payload?.data?.object?.metadata?.gifter_email;
    if (!gifterEmail) return Response.json({ error: "Missing gifter email" }, { status: 400 });
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_gifted_count`, {
      method: "POST",
      headers: {
        apikey: serviceKey || "",
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target_email: gifterEmail }),
    });
    if (!response.ok) {
      const profiles = await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(gifterEmail)}`, {
        headers: { apikey: serviceKey || "", Authorization: `Bearer ${serviceKey}` },
      }).then((r) => r.json());
      const profile = Array.isArray(profiles) ? profiles[0] : null;
      if (profile) {
        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${profile.id}`, {
          method: "PATCH",
          headers: {
            apikey: serviceKey || "",
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ gifted_count: (profile.gifted_count || 0) + 1 }),
        });
      }
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Gift webhook error" }, { status: 500 });
  }
});
