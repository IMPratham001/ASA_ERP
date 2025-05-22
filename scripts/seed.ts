
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo stores
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Main Store',
        location: 'New York',
        status: 'active',
      }
    }),
    prisma.store.create({
      data: {
        name: 'Branch Store',
        location: 'Los Angeles',
        status: 'active',
      }
    })
  ]);

  // Create demo customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY',
        detailsStatus: 'verified',
        verifiedBy: 'admin',
        verifiedAt: new Date(),
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0124',
        address: '456 Park Ave, Los Angeles, CA',
        detailsStatus: 'verified',
        verifiedBy: 'admin',
        verifiedAt: new Date(),
      }
    })
  ]);

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
    }),
    prisma.user.create({
      data: {
        email: 'staff@example.com',
        name: 'Staff User',
        role: 'staff',
      }
    })
  ]);

  // Create demo invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        customerId: customers[0].id,
        storeId: stores[0].id,
        total: 1299.99,
        status: 'paid',
      }
    }),
    prisma.invoice.create({
      data: {
        customerId: customers[1].id,
        storeId: stores[1].id,
        total: 899.99,
        status: 'pending',
      }
    })
  ]);

  console.log({
    stores,
    customers,
    users,
    invoices
  });
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
