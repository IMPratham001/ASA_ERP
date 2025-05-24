
import { PrismaClient } from '@prisma/client';
import { DatabaseError } from '../errors/custom-errors';

const prisma = new PrismaClient();

export async function testConnection() {
  try {
    await prisma.$connect();
    
    // Test query
    const userCount = await prisma.user.count();
    console.log('Database connection successful. User count:', userCount);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new DatabaseError('Failed to connect to database');
  } finally {
    await prisma.$disconnect();
  }
}
