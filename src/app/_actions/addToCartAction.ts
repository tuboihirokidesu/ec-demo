'use server';

import { createCart, getCart } from '@/lib/db/cart';
import { prisma } from '@/lib/db/prisma';
import { ActionsResult } from '@/types/ActionsResult';
import { revalidatePath } from 'next/cache';

export async function addToCartAction(
  productId: string
): Promise<ActionsResult> {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);

  try {
    if (articleInCart) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            update: {
              where: { id: articleInCart.id },
              data: { quantity: { increment: 1 } },
            },
          },
        },
      });
    } else {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            create: {
              productId,
              quantity: 1,
            },
          },
        },
      });
    }
    revalidatePath('/');

    return { isSuccess: true, message: 'Product added to cart' };
  } catch (error) {
    return { isSuccess: false, error: 'Error adding product to cart' };
  }
}
