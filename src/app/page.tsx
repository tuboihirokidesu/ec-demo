import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/db/product';

export default async function Page() {
  const products = await getProducts();

  return (
    <div className='grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'>
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
