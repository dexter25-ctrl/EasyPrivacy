import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Version stable
});

export async function POST(req: Request) {
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

    // On retourne l'URL pour une redirection directe (plus robuste)
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('STRIPE_ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
