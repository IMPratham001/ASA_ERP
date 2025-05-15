
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
    connectionTimeout: 20000,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
