'use client';

import { useEffect, useState, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/src/store/cartSlice';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [method, setMethod] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    const orderId = searchParams?.get('order_id');
    const payMethod = searchParams?.get('method');
    
    setMethod(payMethod);

    if (sessionId) {
      fetch(`/api/save-order?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            dispatch(clearCart());
            setStatus('done');
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    } 
    else if (orderId && payMethod === 'cod') {
      setStatus('done');
    }
    else {
      router.push('/');
    }
  }, [searchParams, dispatch, router]);

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-48 text-center bg-white dark:bg-black">
        <div className="space-y-8 animate-pulse">
          <div className="h-px w-24 bg-zinc-100 dark:bg-zinc-800 mx-auto"></div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">SYNCHRONIZING TRANSACTION DATA...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-48 text-center bg-white dark:bg-black">
        <div className="border border-red-100 dark:border-red-900/50 p-16 space-y-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-4 text-red-600">VERIFICATION FAILED</h2>
            <p className="text-sm text-zinc-500 uppercase tracking-wide leading-relaxed">
              We encountered a discrepancy while validating your acquisition. <br />
              Please contact technical support immediately.
            </p>
          </div>
          <Link href="/" className="inline-block px-12 py-4 bg-black dark:bg-white text-white dark:text-black text-[11px] font-black tracking-widest uppercase hover:opacity-80 transition-opacity">
            RETURN TO TERMINAL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-48 text-center bg-white dark:bg-black min-h-screen">
      <div className="space-y-16">
        <div className="flex justify-center">
          <div className="h-16 w-16 border border-black dark:border-white flex items-center justify-center">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter uppercase leading-none">
            ORDER <span className="text-zinc-400">MANIFESTED</span>.
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">
            {method === 'cod' 
              ? "FULFILLMENT VIA CASH ON DELIVERY" 
              : "ELECTRONIC TRANSACTION SUCCESSFUL"}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-1 border-t border-b border-zinc-50 dark:border-zinc-900 py-12">
          <p className="text-sm text-zinc-500 uppercase tracking-wide leading-relaxed">
            Your items are being prepared for dispatch. <br />
            An electronic confirmation has been transmitted to your email.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/products"
            className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black text-[11px] font-black tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            CONTINUE BROWSING
          </Link>
          <Link
            href="/dashboard"
            className="px-12 py-5 border border-zinc-100 dark:border-zinc-900 text-[11px] font-black tracking-widest uppercase hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
          >
            VIEW LOGISTICS
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-48 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300">INITIALIZING...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
