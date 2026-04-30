import { PrismaClient } from '@prisma/client';

try {
  const prisma = new PrismaClient();
  console.log("Success with no args");
} catch(e) {
  console.error("Failed with no args:", e);
}

try {
  const prisma2 = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_POSTGRES_PRISMA_URL || "postgres://dummy",
  } as any);
  console.log("Success with dummy URL");
} catch(e) {
  console.error("Failed with dummy URL:", e);
}
