// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

/**
* Type augmentation for global Prisma instance
* Allows for global singleton pattern
*/
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
* Prisma client singleton instance
* Ensures only one instance is created and reused across the application
* Implements connection pooling for optimal database performance
*/
export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;