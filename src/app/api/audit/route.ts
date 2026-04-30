import { NextResponse } from 'next/server';
import { performScan } from '@/lib/scanner';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;


export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Veuillez entrer une URL." }, { status: 400 });
    }

    const results = await performScan(url);
    return NextResponse.json(results);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Impossible de scanner ce site. Vérifiez l'URL." }, { status: 500 });
  }
}