import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Initialisation sécurisée qui ne plante pas au build
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;
  return new Stripe(apiKey, { apiVersion: '2023-10-16' as any });
};

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    console.error('Stripe API key is missing');
    return NextResponse.json({ error: 'Stripe key missing' }, { status: 500 });
  }

  try {
    const { priceId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easy-privacy.vercel.app'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easy-privacy.vercel.app'}/dashboard?canceled=true`,
    });

    // On retourne l'URL pour une redirection directe (méthode la plus robuste)
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('STRIPE_CHECKOUT_ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
