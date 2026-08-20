import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockProducts = [
  {
    id: "ghibli-art-tote",
    name: "CUSTOM GHIBLI ART TOTE BAG",
    description: "Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.",
    price: 499.00,
    oldPrice: 599.00,
    image: "/images/product/W1.png",
    isCustomizable: true,
    category: "Bestseller",
    inventoryCount: 50
  },
  {
    id: "ghibli-text-tote",
    name: "CUSTOM GHIBLI TOTE BAG WITH TEXT",
    description: "Custom Ghibli image + custom text. Add size and approval on WhatsApp after placing orders.",
    price: 599.00,
    oldPrice: 749.00,
    image: "/images/product/W5.png",
    isCustomizable: true,
    category: "Bestseller",
    inventoryCount: 30
  },
  {
    id: "emoji-ghibli-tote",
    name: "CUTE EMOJI WITH GHIBLI TOTE",
    description: "Emoji and text around Ghibli bags. Add size and approval on WhatsApp after placing orders.",
    price: 599.00,
    oldPrice: 719.00,
    image: "/images/product/W9.png",
    isCustomizable: true,
    category: "Bestseller",
    inventoryCount: 20
  },
  {
    id: "polaroid-tote",
    name: "POLAROID TOTE BAG",
    description: "Old vintage type Polaroid design. Add size and approval on WhatsApp after placing orders.",
    price: 499.00,
    oldPrice: 599.00,
    image: "/images/product/W13.png",
    isCustomizable: true,
    category: "New",
    inventoryCount: 100
  },
  {
    id: "any-design-tote",
    name: "ANY DESIGN TOTE BAG",
    description: "Customer can customise any ready to print design. Add size and approval on WhatsApp after placing orders.",
    price: 499.00,
    oldPrice: 599.00,
    image: "/images/product/W17.png",
    isCustomizable: true,
    category: "New",
    inventoryCount: 85
  }
];

async function main() {
  console.log("Upserting the 5 ToteMood shop products...");
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  const allowedIds = mockProducts.map((product) => product.id);
  const extraProducts = await prisma.product.findMany({
    where: {
      id: {
        notIn: allowedIds,
      },
    },
    select: {
      id: true,
    },
  });

  for (const product of extraProducts) {
    try {
      await prisma.product.delete({ where: { id: product.id } });
    } catch {
      console.log(`Keeping ${product.id} because it is tied to an existing order.`);
    }
  }

  console.log("Product catalog is ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
