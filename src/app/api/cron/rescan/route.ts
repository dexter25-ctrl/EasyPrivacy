import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { performScan } from '@/lib/scanner';

export async function GET(req: Request) {
  // Optionnel: Vérification du secret Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Trouver tous les utilisateurs avec un abonnement actif (pro ou enterprise)
    const audits = await prisma.audit.findMany({
      where: {
        user: {
          plan: {
            in: ['pro', 'enterprise']
          }
        }
      }
    });

    const results = [];

    for (const audit of audits) {
      try {
        // 2. Relancer le scan
        const newScan = await performScan(audit.url);

        // 3. Vérifier si le score a changé
        if (newScan.score !== audit.score) {
          await prisma.audit.update({
            where: { id: audit.id },
            data: {
              score: newScan.score,
              criticalPoints: newScan.criticalPoints,
              lastScanAt: newReviewDate(), // Date du jour
            }
          });
          
          results.push({ url: audit.url, status: 'updated', oldScore: audit.score, newScore: newScan.score });
          
          // TODO: Préparer l'envoi d'email ici (notification de changement de score)
          console.log(`Score changed for ${audit.url}: ${audit.score} -> ${newScan.score}`);
        } else {
          results.push({ url: audit.url, status: 'no_change' });
        }
      } catch (scanError) {
        console.error(`Failed to scan ${audit.url}:`, scanError);
        results.push({ url: audit.url, status: 'error' });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, details: results });

  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

function newReviewDate() {
  return new Date();
}
