
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
    connectionTimeout: 30000,
    pool: {
      min: 2,
      max: 10
    }
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
