const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.update({
    where: { id: 'ghibli-text-tote' },
    data: { image: '/images/product/W5.png' }
  });
  console.log('Reverted ghibli-text-tote in DB');
}

main().catch(console.error).finally(() => prisma.$disconnect());
