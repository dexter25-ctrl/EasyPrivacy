import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;


export async function GET() {
  try {
    // 1. On crée un utilisateur test s'il n'existe pas
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        id: 'test-user-id',
        email: 'test@example.com',
        plan: 'free',
      }
    });

    // 2. On crée l'audit test
    const audit = await prisma.audit.create({
      data: {
        url: 'test.com',
        score: 0,
        completedTasks: [],
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, user, audit });
  } catch (error: any) {
    console.error("Test DB error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
