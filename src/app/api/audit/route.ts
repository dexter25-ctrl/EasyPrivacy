import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "L'URL est requise" }, { status: 400 });
    }

    // Simulation de délai
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulation d'un score aléatoire entre 20 et 95
    const score = Math.floor(Math.random() * 76) + 20;

    // Critères critiques potentiels
    const potentialIssues = [
      "Bandeau cookie absent ou non conforme",
      "Certificat SSL expiré ou invalide",
      "Politique de confidentialité manquante",
      "Formulaire sans case à cocher de consentement",
      "Transfert de données hors UE détecté",
      "Absence de mentions légales",
      "Traceurs tiers non déclarés (Analytics, Ads)",
    ];

    // Sélection aléatoire de 3 points
    const criticalPoints = potentialIssues
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return NextResponse.json({
      url,
      score,
      criticalPoints,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}
