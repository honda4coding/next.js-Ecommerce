'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateProfile } from '@/src/actions/userActions';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const res = await updateProfile({ name, email });
    
    if (res.success) {
      setIsError(false);
      setMessage('PROFILE UPDATED SUCCESSFULLY.');
      await update({ name, email });
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setIsError(true);
      setMessage(res.error?.toUpperCase() || 'UPDATE FAILED.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">EDIT PROFILE</h1>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">Update your account credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {message && (
          <div className={`p-4 border ${isError ? 'border-red-200 text-red-600 bg-red-50' : 'border-zinc-200 text-zinc-600 bg-zinc-50'} text-[10px] font-black tracking-widest uppercase`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">FULL_NAME</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black focus:outline-none uppercase"
              placeholder="YOUR NAME"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">EMAIL_ADDRESS</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 text-2xl font-black focus:outline-none uppercase"
              placeholder="EMAIL@EXAMPLE.COM"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-8 bg-black dark:bg-white text-white dark:text-black text-[12px] font-black tracking-[0.4em] uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'SAVING_CHANGES...' : 'SAVE_CHANGES'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-16 py-8 border-4 border-black dark:border-white text-[12px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
