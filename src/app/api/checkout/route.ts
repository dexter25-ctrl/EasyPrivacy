import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Tentative de checkout pour le Price ID:", body.priceId);

    if (!body.priceId?.startsWith('price_')) {
      console.warn("Format de Price ID potentiellement invalide:", body.priceId);
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY manquante");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    if (!body.priceId) {
      return NextResponse.json({ error: "L'ID de produit (priceId) est manquant" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    });

    const plan = body.priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE ? 'enterprise' : 'pro';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: body.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://easy-privacy.vercel.app/dashboard?success=true&plan=${plan}`,
      cancel_url: `https://easy-privacy.vercel.app/dashboard?canceled=true`,
      metadata: {
        auditUrl: body.auditUrl || 'Non spécifié',
        auditScore: body.auditScore?.toString() || '0',
        plan: plan
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: "Payment Session Error" }, { status: 500 });
  }
}
