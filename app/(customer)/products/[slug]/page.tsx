import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/src/actions/productActions';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';

export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 min-h-screen bg-white dark:bg-black">
      <div className="mb-16">
        <Link href="/products" className="text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-[0.4em] transition-colors flex items-center gap-2">
          ← BACK_TO_COLLECTION
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
        <div className="relative aspect-square w-full bg-white dark:bg-black border-4 border-black dark:border-white overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-1000 hover:opacity-90"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400">
              NO_IMAGE_DATA
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-10">
            <div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-4 border-b-2 border-zinc-100 dark:border-zinc-900 pb-2 inline-block">
                {product.category?.name || 'ESSENTIAL_EDITION'}
              </p>
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter uppercase mb-8 leading-[0.85]">
                {product.name}
              </h1>
              <p className="text-4xl font-black tracking-tighter">${product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-4 pt-10 border-t-4 border-black dark:border-white">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em]">SPECIFICATIONS_DESCRIPTION</h3>
              <p className="text-sm text-zinc-500 leading-relaxed uppercase tracking-widest">
                {product.description}
              </p>
            </div>
            
            <div className="pt-10 border-t-4 border-black dark:border-white flex items-center justify-between">
              <span className={`text-[11px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `● IN_STOCK_QTY_${product.stock}` : '○ OUT_OF_STOCK'}
              </span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">UNIT_ID: {product._id.toString().slice(-8).toUpperCase()}</span>
            </div>

            <div className="pt-8">
              <AddToCartButton product={product} />
            </div>

            <p className="text-[10px] font-black text-zinc-400 text-center md:text-left mt-12 uppercase tracking-widest leading-loose">
              GLOBAL_SHIPPING_INCLUDED_FREE. <br />
              30_DAY_WARRANTY_RETURN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
