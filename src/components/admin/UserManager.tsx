'use client';

import { useState, useEffect } from 'react';
import { toggleUserRole, toggleUserStatus } from '@/src/actions/userActions';

export default function UserManager({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [mounted, setMounted] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    setLoadingId(id);
    try {
      const res = await toggleUserRole(id, newRole);
      if (res.success) setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? 'Suspend user?' : 'Activate user?')) return;
    setLoadingId(id);
    try {
      const res = await toggleUserStatus(id, currentStatus);
      if (res.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoadingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-16 gap-6">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2 leading-none break-words">Users</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] mt-4 break-words">Manage user accounts</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[12px] font-black text-zinc-400 uppercase tracking-widest block">{users.length} Users Found</span>
        </div>
      </div>
      <div className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-black border-b-4 border-black dark:border-white text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="px-4 py-4 md:px-10 md:py-8 whitespace-nowrap">Name</th>
              <th className="px-4 py-4 md:px-10 md:py-8 whitespace-nowrap">Email</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-center whitespace-nowrap">Role</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-right whitespace-nowrap">Joined</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black dark:divide-white">
            {users.map((u: any) => (
              <tr key={u._id} className={`hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all ${loadingId === u._id ? 'opacity-30' : ''}`}>
                <td className="px-4 py-6 md:px-10 md:py-10 font-black text-lg md:text-2xl tracking-tighter uppercase whitespace-nowrap">{u.name}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-xs font-mono font-bold uppercase whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-center whitespace-nowrap">
                  <button 
                    onClick={() => handleToggleRole(u._id, u.role)}
                    disabled={loadingId === u._id}
                    className={`text-[11px] font-black px-8 py-3 border-4 transition-all ${u.role === 'admin' ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-black dark:hover:border-white'}`}
                  >
                    {u.role.toUpperCase()}
                  </button>
                </td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-right text-[11px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString('en-US')}
                </td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-right whitespace-nowrap">
                  <button 
                    onClick={() => handleToggleStatus(u._id, u.isActive !== false)}
                    disabled={loadingId === u._id}
                    className={`text-[12px] font-black uppercase tracking-widest border-b-2 pb-1 ${u.isActive !== false ? 'text-red-500 border-red-500' : 'text-green-500 border-green-500'}`}
                  >
                    {u.isActive !== false ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
