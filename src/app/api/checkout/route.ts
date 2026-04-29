import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, auditUrl, auditScore } = body;

    console.log("--- DEBUG STRIPE CHECKOUT ---");
    console.log("Price ID reçu:", priceId);
    console.log("Clé secrète (début):", process.env.STRIPE_SECRET_KEY?.substring(0, 7) + "...");

    // 1. Validation du Price ID
    if (!priceId || !priceId.startsWith('price_')) {
      console.error("ERREUR: Price ID invalide ou manquant:", priceId);
      return NextResponse.json({ 
        error: "Invalid Price ID", 
        details: `L'identifiant fourni (${priceId}) est incorrect.` 
      }, { status: 400 });
    }

    // 2. Vérification de la clé secrète
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("ERREUR: STRIPE_SECRET_KEY manquante dans l'environnement");
      return NextResponse.json({ error: "Configuration Error: Secret Key Missing" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    });

    const plan = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRISE ? 'enterprise' : 'pro';

    // 3. Tentative de création de session
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
      console.error("ERREUR STRIPE DÉTAILLÉE:", {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param
      });
      return NextResponse.json({ 
        error: "Stripe Session Creation Failed", 
        details: stripeError.message 
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error("ERREUR GLOBALE CHECKOUT:", err.message);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
