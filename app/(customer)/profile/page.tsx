'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateProfile } from '@/src/actions/userActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      setMessage('SUCCESS: PROFILE_SYNCHRONIZED');
      await update({ name, email });
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setIsError(true);
      setMessage(`ERROR: ${res.error?.toUpperCase() || 'UPDATE_FAILED'}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="mb-12 md:mb-20 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-1 w-8 md:w-12 bg-black dark:bg-white" />
          <p className="text-[9px] md:text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase">Profile_Edit_Mode</p>
        </div>
        <h1 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] md:leading-[0.8]">
          Edit <br />
          Profile.
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
        <div className="md:col-span-8 space-y-12 md:space-y-16">
          {message && (
            <div className={`p-6 md:p-8 border-4 ${isError ? 'border-red-500 text-red-500' : 'border-black dark:border-white text-black dark:text-white'} text-[10px] md:text-[11px] font-black tracking-widest uppercase`}>
              {message}
            </div>
          )}

          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Full_Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b-4 md:border-b-8 border-zinc-100 dark:border-zinc-900 focus:border-black dark:focus:border-white py-4 md:py-6 text-xl md:text-5xl font-black focus:outline-none uppercase transition-colors text-black dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                placeholder="YOUR NAME"
              />
            </div>

            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Email_Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-4 md:border-b-8 border-zinc-100 dark:border-zinc-900 focus:border-black dark:focus:border-white py-4 md:py-6 text-xl md:text-5xl font-black focus:outline-none uppercase transition-colors text-black dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                placeholder="EMAIL@SYSTEM.COM"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-6 md:py-8 bg-black dark:bg-white text-white dark:text-black text-[11px] md:text-[12px] font-black tracking-[0.4em] uppercase hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Save_Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 md:px-12 py-6 md:py-8 border-4 border-black dark:border-white text-[11px] md:text-[12px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-[0.98]"
            >
              Discard
            </button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6 md:space-y-8 pt-4 md:pt-4">
          <div className="p-6 md:p-8 border-4 border-zinc-100 dark:border-zinc-900 space-y-4 md:space-y-6">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Security_Info</h3>
            <p className="text-[10px] md:text-[11px] leading-relaxed text-zinc-500 uppercase tracking-wide">
              Your email is used for login and notifications. Changing it will require re-authentication.
            </p>
          </div>
          
          <div className="p-6 md:p-8 border-4 border-zinc-100 dark:border-zinc-900 space-y-3 md:space-y-4">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Session_Data</h3>
            <div className="text-[11px] md:text-[12px] font-black uppercase truncate">
              ID: {session?.user?.id?.slice(0, 8)}...
            </div>
            <div className="text-[11px] md:text-[12px] font-black uppercase">
              Role: {(session?.user as any)?.role || 'Customer'}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
