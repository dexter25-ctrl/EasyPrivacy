import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const audit = await prisma.audit.findUnique({
      where: { userId },
    });

    return NextResponse.json(audit);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}
