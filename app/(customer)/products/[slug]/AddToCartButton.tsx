'use client';

import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/src/store/cartSlice';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(
      addItemToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.png',
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock <= 0}
      className={`w-full py-5 px-12 text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-300 ${
        product.stock > 0
          ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-800'
      }`}
    >
      {added ? 'ADDED TO BAG' : product.stock > 0 ? 'ADD TO BAG' : 'SOLD OUT'}
    </button>
  );
}
