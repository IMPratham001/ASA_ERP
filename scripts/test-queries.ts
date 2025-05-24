
import { prisma } from '../lib/prisma'

async function testQueries() {
  try {
    // Test query to get all stores
    const stores = await prisma.store.findMany()
    console.log('Stores:', stores)

    // Test query to get all active customers
    const customers = await prisma.customer.findMany({
      where: {
        detailsStatus: 'verified'
      }
    })
    console.log('Verified Customers:', customers)

    // Test query to get total invoices amount
    const invoices = await prisma.invoice.aggregate({
      _sum: {
        total: true
      }
    })
    console.log('Total Invoices Amount:', invoices._sum.total)

  } catch (error) {
    console.error('Query Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testQueries()
