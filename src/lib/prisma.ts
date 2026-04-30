import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const prismaClientSingleton = () => {
  // Contournement nucléaire : on empêche l'instanciation pendant le build Vercel
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new Proxy({}, { get: () => () => Promise.resolve() }) as unknown as PrismaClient
  }
  
  const connectionString = process.env.DATABASE_URL_POSTGRES_PRISMA_URL || "postgres://dummy:dummy@dummy:5432/dummy"
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma