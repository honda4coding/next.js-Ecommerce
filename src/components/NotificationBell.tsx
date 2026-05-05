'use client';

import { useState, useEffect, useRef } from 'react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-black dark:bg-white border border-white dark:border-black animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-20 right-4 w-[calc(100vw-2rem)] sm:absolute sm:top-auto sm:right-0 sm:mt-6 sm:w-80 bg-white dark:bg-black border-4 border-black dark:border-white py-8 shadow-2xl animate-in fade-in slide-in-from-top-1 z-50">
          <div className="px-8 pb-4 border-b-2 border-black dark:border-white mb-6 flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Notifications</h3>
            <span className="text-[10px] font-bold text-zinc-400">{notifications.length}</span>
          </div>

          <div className="max-h-80 overflow-y-auto px-8 space-y-8">
            {notifications.length > 0 ? notifications.map((n, i) => (
              <div key={i} className="space-y-2 border-b border-zinc-100 dark:border-zinc-900 pb-4 last:border-0">
                <p className="text-xs font-bold uppercase tracking-tight leading-tight">{n.message}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            )) : (
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest text-center py-12">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
