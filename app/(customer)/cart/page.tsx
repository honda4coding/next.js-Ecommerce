'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { deleteFromCart, updateQuantity } from '@/src/store/cartSlice';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-24 lg:px-8 bg-white dark:bg-black min-h-screen overflow-hidden w-full">
      <div className="mb-12 sm:mb-24 border-b-4 border-black dark:border-white pb-8 sm:pb-12">
        <h1 className="text-4xl sm:text-7xl font-bold tracking-tighter uppercase leading-none break-words">Shopping Cart</h1>
        <p className="text-[10px] sm:text-[11px] font-black text-black dark:text-white uppercase tracking-widest sm:tracking-[0.5em] mt-4 sm:mt-6 opacity-50 break-words">
          {mounted ? cartItems.length : 0} Items in Cart
        </p>
      </div>

      {!mounted ? (
        <div className="py-64 text-center border-4 border-black dark:border-white">
          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.6em] animate-pulse">Loading Cart...</p>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          <div className="lg:col-span-8 space-y-16">
            {cartItems.map((item) => (
              <div key={item.id} className="group flex flex-col md:flex-row gap-12 pb-16 border-b-4 border-black dark:border-white last:border-0">
                <div className="w-full md:w-56 aspect-square bg-white dark:bg-black border-4 border-black dark:border-white overflow-hidden transition-all">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">No Image</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-2 sm:space-y-4">
                      <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tighter leading-none break-words">{item.name}</h3>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.2em] break-words">Item ID: {item.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tighter break-all">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 md:mt-0 gap-6 sm:gap-0">
                    <div className="flex items-center border-4 border-black dark:border-white w-fit">
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                        className="px-4 sm:px-6 py-2 sm:py-3 text-lg font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        —
                      </button>
                      <span className="px-6 sm:px-8 py-2 sm:py-3 text-xs font-black tracking-widest border-x-4 border-black dark:border-white min-w-[50px] sm:min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="px-4 sm:px-6 py-2 sm:py-3 text-lg font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => dispatch(deleteFromCart(item.id))}
                      className="text-[10px] sm:text-[11px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 sm:p-12 space-y-12 sm:space-y-16">
              <h3 className="text-[11px] sm:text-[12px] font-black tracking-widest sm:tracking-[0.4em] uppercase border-b-4 border-black dark:border-white pb-6 break-words">Order Summary</h3>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                  <span className="text-zinc-400 font-black">Subtotal</span>
                  <span className="font-black text-xl break-all">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                  <span className="text-zinc-400 font-black">Shipping</span>
                  <span className="font-black italic">Free</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs uppercase tracking-widest border-t-4 border-black dark:border-white pt-8 sm:pt-10">
                  <span className="font-black text-sm">Total</span>
                  <span className="text-4xl sm:text-5xl font-bold tracking-tighter break-all">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <Link 
                  href="/checkout" 
                  className="block w-full py-8 bg-black dark:bg-white text-white dark:text-black text-center text-[12px] font-black tracking-[0.4em] uppercase hover:opacity-80 transition-opacity"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  href="/products" 
                  className="block w-full py-8 border-4 border-black dark:border-white text-center text-[12px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-32 sm:py-64 px-4 text-center border-4 border-black dark:border-white space-y-12 sm:space-y-16 mx-4 sm:mx-0">
           <div>
              <p className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase mb-6 leading-none break-words">Empty Cart</p>
              <p className="text-[10px] sm:text-[14px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.6em] break-words">Add items to your cart to checkout.</p>
           </div>
           <Link href="/products" className="inline-block px-8 sm:px-16 py-6 sm:py-8 bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-[12px] font-black tracking-widest uppercase hover:opacity-80 transition-opacity">
             Browse Products
           </Link>
        </div>
      )}
    </div>
  );
}
