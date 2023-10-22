import { ShoppingCart } from '@/lib/db/cart';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

type Props = {
  cart: ShoppingCart | null;
};

export default function ShoppingCartButton({ cart }: Props) {
  return (
    <div className='w-10 h-10 relative flex justify-center items-center'>
      {cart?.size && (
        <div className='absolute top-0.5 right-0.5 w-4 h-4 bg-secondary-foreground rounded-full text-white text-xs flex justify-center items-center'>
          {cart.size}
        </div>
      )}
      <ShoppingCartIcon size={24} />
    </div>
  );
}
