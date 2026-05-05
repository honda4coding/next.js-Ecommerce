'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error?.toUpperCase() || 'REGISTRATION FAILED');
      }
    } catch (err: any) {
      setError(`NETWORK ERROR: ${err.message || 'UNKNOWN'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-white dark:bg-black">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">REGISTER</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">JOIN_THE_NETWORK</p>
        </div>

        {error && (
          <div className="text-[10px] font-black tracking-widest text-red-500 text-center uppercase border-2 border-red-500 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">IDENTITY_NAME</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-sm font-bold focus:outline-none transition-colors uppercase"
                placeholder="FULL_NAME"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">EMAIL_ADDRESS</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-sm font-bold focus:outline-none transition-colors"
                placeholder="EMAIL@DOMAIN.COM"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SECRET_KEY</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-sm font-bold focus:outline-none transition-colors"
                placeholder="********"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-black dark:bg-white text-white dark:text-black text-[12px] font-black tracking-[0.3em] uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'REGISTER_IDENTITY'}
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
          ALREADY_REGISTERED?{' '}
          <Link href="/login" className="text-black dark:text-white border-b-2 border-black dark:border-white pb-0.5 hover:opacity-50 transition-all">SIGN_IN</Link>
        </p>
      </div>
    </div>
  );
}
