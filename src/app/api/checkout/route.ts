import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIKE_CHECKOUT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
