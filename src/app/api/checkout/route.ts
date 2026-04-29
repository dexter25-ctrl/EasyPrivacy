import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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

    console.log("--- TENTATIVE CHECKOUT ---");
    console.log("Price ID:", priceId);

    if (!priceId) {
      return NextResponse.json({ error: "Missing Price ID" }, { status: 400 });
    }

    // 2. Initialisation de Stripe à l'intérieur du handler
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16' as any,
    });

    const plan = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE ? 'enterprise' : 'pro';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `https://easy-privacy.vercel.app/dashboard?success=true&plan=${plan}`,
        cancel_url: `https://easy-privacy.vercel.app/dashboard?canceled=true`,
        metadata: {
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
