import Link from 'next/link';
import ShoppingCartButton from '../ShoppingCartButton';
import { getCart } from '@/lib/db/cart';
import UserNavButton from '../UserNavButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function PageHeader() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='items-center space-x-2 flex'>
          <span className='font-bold inline-block'>EC Demo</span>
          <span className='sr-only'>Home</span>
        </Link>
        <div className='flex gap-4 items-center'>
          <ShoppingCartButton cart={cart} />
          <UserNavButton session={session} />
        </div>
      </div>
    </header>
  );
}
