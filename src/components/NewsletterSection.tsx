'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsError(false);
        setMessage('SUCCESSFULLY_SUBSCRIBED.');
        setEmail('');
      } else {
        setIsError(true);
        setMessage('ALREADY_SUBSCRIBED_OR_ERROR.');
      }
    } catch {
      setIsError(true);
      setMessage('COMMUNICATION_ERROR.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-48 border-t-4 border-black dark:border-white bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-6xl font-bold tracking-tighter uppercase mb-8 leading-none">JOIN THE NETWORK</h2>
        <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.6em] mb-20 max-w-xl mx-auto leading-relaxed">
          GET EXCLUSIVE ACCESS TO THE LATEST SKU RELEASES AND OPERATIONAL UPDATES.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto border-4 border-black dark:border-white">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="EMAIL_ADDRESS@DOMAIN.COM"
            className="flex-1 bg-transparent px-10 py-6 text-xs font-black tracking-widest focus:outline-none uppercase placeholder:text-zinc-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-16 py-6 bg-black dark:bg-white text-white dark:text-black text-[12px] font-black tracking-[0.3em] uppercase hover:opacity-80 transition-opacity disabled:opacity-50 border-l-4 border-black dark:border-white"
          >
            {loading ? 'WAITING...' : 'SUBSCRIBE'}
          </button>
        </form>
        
        {message && (
          <p className={`mt-12 text-[10px] font-black tracking-[0.5em] uppercase ${isError ? 'text-red-500' : 'text-zinc-500'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
