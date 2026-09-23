import Stripe from "npm:stripe@14";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return Response.json({ error: "Stripe is not configured." }, { status: 503 });
    const stripe = new Stripe(stripeKey);
    const { successUrl, cancelUrl, plan, giftEmail, gifterEmail } = await req.json();
    const priceId = plan === "yearly" ? "price_1TVphmEMFirrQavfWlRig1Fe" : "price_1TVphmEMFirrQavfVAlmaSUc";
    let discounts;
    if (giftEmail && plan === "yearly") {
      const coupon = await stripe.coupons.create({ percent_off: 33, duration: "once", name: "Pay It Forward Gift - Yearly" });
      discounts = [{ coupon: coupon.id }];
    }
    const subscriptionData = giftEmail ? { trial_period_days: 90, metadata: { gifter_reward: "true" } } : undefined;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(discounts ? { discounts } : {}),
      ...(subscriptionData ? { subscription_data: subscriptionData } : {}),
      success_url: successUrl || "v1ce://premium?success=1",
      cancel_url: cancelUrl || "v1ce://premium",
      metadata: { gift_recipient_email: giftEmail || "", gifter_reward: giftEmail ? "3_months_free" : "", gifter_email: gifterEmail || "" }
    });
    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkout error" }, { status: 500 });
  }
});