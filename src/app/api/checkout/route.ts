export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Vérification stricte de la clé secrète dès le début
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret || !stripeSecret.startsWith('sk_')) {
    console.error("ERREUR CRITIQUE: STRIPE_SECRET_KEY manquante ou invalide dans Vercel");
    return NextResponse.json({ 
      error: 'CLÉ SECRÈTE MANQUANTE OU INVALIDE DANS VERCEL',
      details: "Assurez-vous d'avoir configuré STRIPE_SECRET_KEY (sk_live_...) dans les variables d'environnement Vercel."
    }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { priceId, auditUrl, auditScore } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Missing Price ID" }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16' as any,
    });

    const plan = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE ? 'enterprise' : 'pro';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        client_reference_id: userId,
        success_url: `https://easy-privacy.vercel.app/dashboard?success=true&plan=${plan}`,
        cancel_url: `https://easy-privacy.vercel.app/dashboard?canceled=true`,
        metadata: {
          userId: userId,
          auditUrl: auditUrl || 'Non spécifié',
          auditScore: auditScore?.toString() || '0',
          plan: plan
        }
      });

      return NextResponse.json({ url: session.url });
    } catch (stripeError: any) {
      console.error("STRIKE ERROR:", stripeError.message);
      return NextResponse.json({ error: stripeError.message }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
