import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Requête reçue pour priceId:", body.priceId);

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Clé STRIPE_SECRET_KEY manquante");
      return NextResponse.json({ error: "La clé STRIPE_SECRET_KEY est absente sur Vercel" }, { status: 500 });
    }

    if (!body.priceId || body.priceId === 'TON_ID_PRO') {
      return NextResponse.json({ error: "L'ID de produit (priceId) est manquant ou non configuré" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: body.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://easy-privacy.vercel.app/dashboard?success=true`,
      cancel_url: `https://easy-privacy.vercel.app/dashboard?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erreur Stripe détaillée:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
