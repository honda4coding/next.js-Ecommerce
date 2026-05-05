'use client';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/src/store/cartSlice';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category?: any;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addItemToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: 1,
      })
    );
  };

  return (
    <div className="group flex flex-col h-full bg-transparent">
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full mb-8 overflow-hidden bg-white dark:bg-black border-4 border-black dark:border-white transition-all group-hover:bg-black dark:group-hover:bg-white">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
            No Image
          </div>
        )}
      </Link>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold tracking-tighter uppercase leading-none group-hover:opacity-70 transition-opacity">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <span className="text-xl font-black tracking-tighter">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {product.category?.name || 'Uncategorized'}
        </p>
        
        <button
          onClick={handleAddToCart}
          className="w-full py-4 border-4 border-black dark:border-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
