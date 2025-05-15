
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create roles first
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      permissions: {
        create: [
          { name: 'manage_users' },
          { name: 'manage_stores' },
          { name: 'manage_inventory' }
        ]
      }
    }
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'manager',
      permissions: {
        create: [
          { name: 'manage_inventory' },
          { name: 'manage_orders' }
        ]
      }
    }
  });

  // Create test users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      roles: {
        connect: { id: adminRole.id }
      }
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@test.com',
      name: 'Manager User',
      password: await bcrypt.hash('manager123', 10),
      roles: {
        connect: { id: managerRole.id }
      }
    }
  });

  console.log({ adminUser, managerUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
