import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { Session, getServerSession } from 'next-auth';
import { cookies } from 'next/dist/client/components/headers';

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  const cart: CartWithProducts | null = await findCart(session);

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ),
  };
}

async function findCart(
  session: Session | null
): Promise<CartWithProducts | null> {
  if (session) {
    return await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  }

  const localCartId = cookies().get('localCartId')?.value;
  return localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);

  const newCart: Cart = await createNewCart(session);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

async function createNewCart(session: Session | null): Promise<Cart> {
  if (session) {
    return await prisma.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    const cart = await prisma.cart.create({
      data: {},
    });

    cookies().set('localCartId', cart.id);
    return cart;
  }
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get('localCartId')?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set('localCartId', '');
  });
}

function mergeCartItems(...cartItems: CartItem[][]): CartItem[] {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
