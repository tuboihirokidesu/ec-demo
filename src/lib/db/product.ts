import { Product } from '@prisma/client';
import { prisma } from './prisma';

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });

  return products;
}
