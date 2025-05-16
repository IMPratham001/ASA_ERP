
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop',
        sku: 'LAP-001',
        price: 999.99,
        inventory: {
          create: {
            quantity: 50,
            minQuantity: 10,
            location: 'Main Warehouse'
          }
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone',
        sku: 'PHN-001',
        price: 599.99,
        inventory: {
          create: {
            quantity: 100,
            minQuantity: 20,
            location: 'Main Warehouse'
          }
        }
      }
    })
  ])

  console.log('Added products:', products)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
