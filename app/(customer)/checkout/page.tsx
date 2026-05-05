'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function CheckoutContent() {
  const { data: session, status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount || 0);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setAddress(prev => ({
        ...prev,
        fullName: session.user?.name || '',
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
      const sessionData = await response.json();
      if (sessionData.error) throw new Error(sessionData.error);
      window.location.href = sessionData.url;
    } catch (error) {
      alert('SYSTEM_ERROR_RETRY_LATER');
      setLoading(false);
    }
  };

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-black dark:border-white border-t-transparent animate-spin mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">SYNCHRONIZING_SYSTEM_STATE...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-48 text-center bg-white dark:bg-black">
        <div className="py-24 sm:py-32 border-4 border-dashed border-black dark:border-white space-y-8 sm:space-y-12">
          <p className="text-4xl sm:text-7xl font-bold tracking-tighter uppercase leading-none break-words">Empty Cart</p>
          <p className="text-[10px] sm:text-[12px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.6em] break-words">Your cart has no items</p>
          <Link href="/products" className="inline-block px-8 sm:px-16 py-6 bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-[12px] font-black tracking-widest sm:tracking-[0.4em] uppercase hover:opacity-80 transition-opacity">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-24 lg:px-8 bg-white dark:bg-black min-h-screen overflow-hidden w-full">
      <div className="mb-12 sm:mb-24 border-b-4 border-black dark:border-white pb-8 sm:pb-12">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase leading-none mb-4 sm:mb-6 break-words">CHECKOUT</h1>
        <p className="text-[10px] sm:text-[12px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] break-words">Complete your purchase</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-8 space-y-16 sm:space-y-24">
          <section className="space-y-8 sm:space-y-12">
            <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] border-b-4 border-black dark:border-white pb-6 inline-block break-words">1. Payment Method</h2>
            <div className="grid grid-cols-1 gap-8">
              <div
                className="p-8 sm:p-12 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-left"
              >
                <p className="text-lg sm:text-xl font-black uppercase mb-2">Online Payment</p>
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-50">Securely processed by Stripe</p>
              </div>
            </div>
          </section>

          <section className="space-y-8 sm:space-y-12">
            <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] border-b-4 border-black dark:border-white pb-6 inline-block break-words">2. Shipping Details</h2>
            <form id="order-form" onSubmit={(e) => { e.preventDefault(); handleStripeCheckout(); }} className="space-y-8 sm:space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div className="sm:col-span-2 space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                  <input required type="text" name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 sm:py-6 text-xl sm:text-3xl font-black focus:outline-none uppercase" placeholder="JOHN DOE" />
                </div>
                <div className="sm:col-span-2 space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Street Address</label>
                  <input required type="text" name="address" value={address.address} onChange={handleInputChange} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 sm:py-6 text-xl sm:text-3xl font-black focus:outline-none uppercase" placeholder="123 MAIN ST" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">City</label>
                  <input required type="text" name="city" value={address.city} onChange={handleInputChange} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 sm:py-6 text-lg sm:text-2xl font-black focus:outline-none uppercase" placeholder="NEW YORK" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Postal Code</label>
                  <input required type="text" name="postalCode" value={address.postalCode} onChange={handleInputChange} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 sm:py-6 text-lg sm:text-2xl font-black focus:outline-none uppercase" placeholder="10001" />
                </div>
              </div>
            </form>
          </section>
        </div>

        <div className="lg:col-span-4 mt-8 sm:mt-0">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 sm:p-12 sticky top-32 shadow-2xl space-y-8 sm:space-y-16">
            <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] border-b-4 border-black dark:border-white pb-6 break-words">Order Summary</h2>
            <div className="space-y-8">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start text-[12px] font-black uppercase gap-4">
                  <span className="text-zinc-400 flex-1">{item.quantity}X {item.name}</span>
                  <span className="whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t-4 border-black dark:border-white pt-8 sm:pt-12 space-y-4 sm:space-y-6">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.2em]">
                <span className="text-zinc-400">Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.2em]">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-green-600 font-black">Free</span>
              </div>
              <div className="flex justify-between items-end pt-6 sm:pt-10 border-t-2 border-zinc-100 dark:border-zinc-900 mt-4">
                <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest sm:tracking-[0.4em]">Total</span>
                <span className="text-3xl sm:text-5xl font-bold tracking-tighter leading-none break-all">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="order-form"
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black text-[12px] sm:text-[14px] font-black tracking-widest sm:tracking-[0.4em] uppercase py-6 sm:py-10 hover:opacity-80 transition-all disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-[12px] font-black uppercase tracking-[0.8em] animate-pulse">LOADING_SECURE_MODULE...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
