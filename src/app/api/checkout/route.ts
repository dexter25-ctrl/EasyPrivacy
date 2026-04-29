import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, auditUrl, auditScore } = body;

    console.log("--- DEBUG LIVE ---");
    console.log("Price ID (10 chars):", priceId?.substring(0, 10));

    // 1. Validation de base
    if (!priceId) {
      return NextResponse.json({ error: "Missing Price ID" }, { status: 400 });
    }

    // 2. Initialisation forcée avec !
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });

    const plan = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE ? 'enterprise' : 'pro';

    // 3. Création de session avec gestion d'erreur directe
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
      console.error("STRIKE ERROR LOG:", stripeError.message);
      // On renvoie l'erreur directe à l'utilisateur pour le debug front
      return NextResponse.json({ error: stripeError.message }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
