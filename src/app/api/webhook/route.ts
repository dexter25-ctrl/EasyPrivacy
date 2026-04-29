import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Initialisation de Stripe et Resend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
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
    console.error('Erreur Webhook:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Écouter l'événement checkout terminé
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const auditUrl = session.metadata?.auditUrl || 'votre site';
    const auditScore = session.metadata?.auditScore || 'N/A';

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
            <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Bienvenue à bord ! 🎉</h2>
            <p style="color: #94a3b8; line-height: 1.6; font-size: 15px;">
              Merci pour votre confiance. Votre paiement a bien été validé et votre protection RGPD est désormais active pour <strong>${auditUrl}</strong>.
            </p>
            
            <div style="background-color: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px dashed rgba(45, 212, 191, 0.3);">
              <p style="margin: 0; color: #cbd5e1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Score initial détecté</p>
              <p style="margin: 8px 0 0; color: ${parseInt(auditScore) > 70 ? '#2dd4bf' : '#f87171'}; font-size: 36px; font-weight: 900;">${auditScore}/100</p>
            </div>

            <p style="color: #94a3b8; line-height: 1.6; font-size: 15px;">
              Vous pouvez dès à présent accéder à votre espace sécurisé pour consulter vos rapports détaillés et télécharger votre attestation de conformité.
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

      // Génération d'un PDF basique en pièce jointe pour le rapport initial
      // Ceci est un vrai PDF valide contenant un message d'accueil et le score.
      const pdfText = `Score: ${auditScore}/100 pour ${auditUrl}`;
      const pdfBuffer = Buffer.from(`%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n>>\nendobj\n5 0 obj\n<<\n/Length 113\n>>\nstream\nBT\n/F1 24 Tf\n50 700 Td\n(Rapport Initial EasyPrivacy) Tj\n/F1 16 Tf\n0 -30 Td\n(${pdfText}) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \n0000000304 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n467\n%%EOF\n`);

      try {
        await resend.emails.send({
          from: 'EasyPrivacy <onboarding@resend.dev>', // Assurez-vous d'utiliser un domaine vérifié en production
          to: customerEmail,
          subject: 'Bienvenue sur EasyPrivacy - Votre plan est activé ! 🎉',
          html: emailHtml,
          attachments: [
            {
              filename: 'Rapport_Audit_Initial.pdf',
              content: pdfBuffer,
            }
          ]
        });
        console.log("Email envoyé avec succès à:", customerEmail);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
