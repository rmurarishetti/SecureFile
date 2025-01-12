// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  // Configure connection limits for t2.micro
  connection: {
    pool: {
      min: 1,
      max: 3
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma