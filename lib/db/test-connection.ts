
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
import { prisma } from '@/lib/prisma';

export async function testConnections() {
  try {
    // Test Prisma connection
    const prismaTest = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Prisma connection successful:', prismaTest);

    // Verify key tables exist
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const customerCount = await prisma.customer.count();

    console.log('Database tables verified:', {
      categories: categoryCount,
      products: productCount,
      customers: customerCount
    });

    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default testConnections;
