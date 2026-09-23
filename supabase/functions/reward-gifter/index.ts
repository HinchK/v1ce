import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const { email } = await req.json();
    if (!email) return Response.json({ error: "email required" }, { status: 400 });
    return Response.json({
      success: true,
      email,
      credit: "3_months",
      note: "Apply a 3-month premium credit after the 60-day gift delay.",
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Reward error" }, { status: 500 });
  }
});
