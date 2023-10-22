import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 5つの製品データを作成します
  for (let i = 0; i < 5; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i + 1}`,
        description: `Description for product ${i + 1}`,
        imageUrl:
          'https://unsplash.com/photos/space-gray-apple-watch-with-black-sports-band-hbTKIbuMmBI',
        price: 1000 * (i + 1),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
