import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, score, criticalPoints, completedTasks, plan } = await req.json();

    const audit = await prisma.audit.upsert({
      where: { userId },
      update: {
        url,
        score,
        criticalPoints,
        completedTasks,
      },
      create: {
        userId,
        url,
        score,
        criticalPoints,
        completedTasks: completedTasks || [],
      },
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Save audit error:", error);
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
  }
}
