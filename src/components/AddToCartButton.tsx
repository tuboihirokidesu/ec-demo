'use client';

import { Loader2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useTransition } from 'react';
import { useToast } from './ui/use-toast';
import { addToCartAction } from '@/app/_actions/addToCartAction';

type Props = {
  productId: string;
  addToCartAction: typeof addToCartAction;
};

export default function AddToCartButton({ productId, addToCartAction }: Props) {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const result = await addToCartAction(productId);

      if (result.isSuccess) {
        toast({
          variant: 'default',
          title: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: result.error,
        });
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      <span className='text-white flex gap-2 items-center'>
        Add to cart
        {isPending ? (
          <Loader2 size={16} className='animate-spin' />
        ) : (
          <Plus size={16} />
        )}
      </span>
    </Button>
  );
}
