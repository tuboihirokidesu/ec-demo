import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Product } from '@prisma/client';
import AddToCartButton from './AddToCartButton';
import { addToCartAction } from '@/app/_actions/addToCartAction';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-base font-normal'>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground text-xs'>{product.description}</p>
      </CardContent>
      <CardFooter className='flex flex-row items-center justify-between space-y-0 pt-2'>
        <p className='text-xl font-bold'>
          {product.price} <span className='text-xs font-normal'>yen</span>
        </p>
        <AddToCartButton
          productId={product.id}
          addToCartAction={addToCartAction}
        />
      </CardFooter>
    </Card>
  );
}
