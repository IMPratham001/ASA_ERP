
import { prisma } from '@/lib/prisma';

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 + 1 AS result`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default testConnection;
