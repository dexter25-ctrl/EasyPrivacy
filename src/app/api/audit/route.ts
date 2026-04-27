import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Veuillez entrer une URL." }, { status: 400 });
    }

    // On s'assure que l'URL a bien https:// ou http://
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    // Le score de départ
    let score = 100;
    const criticalPoints: string[] = [];

    // 1. Vérification HTTPS (Sécurité de base)
    if (!targetUrl.startsWith('https://')) {
      score -= 20;
      criticalPoints.push("Le site n'est pas sécurisé (absence de HTTPS).");
    }

    // 2. On "aspire" la page d'accueil du client pour l'analyser
    const response = await fetch(targetUrl);
    const html = await response.text();
    const htmlLower = html.toLowerCase();

    // 3. Vérification du Bandeau Cookie
    const hasCookieKeywords = htmlLower.includes('cookie') || htmlLower.includes('tarteaucitron') || htmlLower.includes('axeptio');
    if (!hasCookieKeywords) {
      score -= 40;
      criticalPoints.push("Aucun système de gestion de cookies détecté sur la page d'accueil.");
    }

    // 4. Vérification de la Politique de confidentialité
    const hasPrivacyKeywords = htmlLower.includes('confidentialité') || htmlLower.includes('privacy') || htmlLower.includes('rgpd');
    if (!hasPrivacyKeywords) {
      score -= 40;
      criticalPoints.push("Lien vers la politique de confidentialité introuvable.");
    }

    // On évite que le score soit négatif
    const finalScore = Math.max(0, score);

    return NextResponse.json({ score: finalScore, criticalPoints });

  } catch (error) {
    return NextResponse.json({ error: "Impossible de scanner ce site. Vérifiez l'URL." }, { status: 500 });
  }
}