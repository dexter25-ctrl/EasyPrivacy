import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;


export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
  });
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const customerEmail = session.customer_details?.email;
    const userId = session.client_reference_id || session.metadata?.userId;
    const auditUrl = session.metadata?.auditUrl || 'votre site';
    const plan = session.metadata?.plan || 'pro';
    const planName = plan === 'enterprise' ? 'Entreprise' : 'Pro';

    // Mise à jour de la base de données
    if (userId) {
      await prisma.user.upsert({
        where: { id: userId },
        update: { plan: plan as string },
        create: {
          id: userId,
          email: customerEmail || 'unknown',
          stripeCustomerId: session.customer as string,
          plan: plan as string,
        }
      });
      
      // On crée aussi un audit initial si besoin
      await prisma.audit.create({
        data: {
          url: auditUrl,
          score: parseInt(session.metadata?.auditScore || '0'),
          completedTasks: [],
          userId: userId,
        }
      });
    }

    if (customerEmail) {
      const emailHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background-color: rgba(45, 212, 191, 0.1); padding: 12px; border-radius: 50%; margin-bottom: 16px;">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L15 20 V50 C15 75 50 95 50 95 C50 95 85 75 85 50 V20 L50 5Z" fill="#2dd4bf" />
                <path d="M40 50 L47 57 L60 43" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">EasyPrivacy</h1>
            <p style="color: #2dd4bf; font-size: 16px; margin-top: 8px; font-weight: 500;">Votre conformité RGPD assurée.</p>
          </div>
          
          <div style="background-color: rgba(255, 255, 255, 0.05); padding: 32px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Votre plan ${planName} est activé ! 🎉</h2>
            <p style="color: #94a3b8; line-height: 1.6; font-size: 15px;">
              Merci pour votre confiance. Votre paiement a bien été validé et votre protection pour <strong>${auditUrl}</strong> est maintenant active sous le plan ${planName}.
            </p>
            
            <p style="color: #94a3b8; line-height: 1.6; font-size: 15px;">
              Vous pouvez dès à présent accéder à votre espace sécurisé pour consulter vos rapports détaillés et mettre en place votre protection.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://easy-privacy.vercel.app/dashboard" style="background: linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%); color: #0f172a; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 20px rgba(45, 212, 191, 0.3);">
                Accéder à mon Dashboard
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 13px; margin-bottom: 0; text-align: center;">
              Si vous avez la moindre question, répondez simplement à cet email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #475569; font-size: 12px;">
              © 2026 EasyPrivacy Compliance SaaS. Tous droits réservés.
            </p>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: customerEmail,
          subject: '🎉 Bienvenue chez EasyPrivacy - Votre rapport est prêt !',
          html: emailHtml,
        });
      } catch (emailError) {
        // Silent error
      }
    }
  }

  return NextResponse.json({ received: true });
}
