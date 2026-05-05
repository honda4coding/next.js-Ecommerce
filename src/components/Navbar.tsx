'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { usePathname } from 'next/navigation';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { data: session } = useSession();
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'PRODUCTS', href: '/products' },
    { name: 'CATEGORIES', href: '/categories' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link href="/" className="text-3xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
            ESHOP.
          </Link>

          <div className="hidden md:flex items-center space-x-16">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-[12px] font-black tracking-[0.4em] transition-colors ${pathname === link.href ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-zinc-400 hover:text-black dark:hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-10">
            
            <NotificationBell />

            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="relative p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-[11px] font-black bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full border-2 border-white dark:border-black">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="relative p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="User menu"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {(session.user as any)?.role === 'admin' && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black dark:bg-white border-2 border-white dark:border-black"></span>
                  )}
                </button>

                {isUserDropdownOpen && (
                  <div className="fixed top-20 right-4 w-[calc(100vw-2rem)] sm:absolute sm:top-auto sm:right-0 sm:mt-8 sm:w-64 bg-white dark:bg-black border-4 border-black dark:border-white py-6 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-8 py-4 border-b-2 border-zinc-100 dark:border-zinc-900 mb-6">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Logged In As</p>
                      <p className="text-sm font-bold truncate">{(session.user as any)?.name?.toUpperCase()}</p>
                    </div>

                    {(session.user as any)?.role === 'admin' && (
                      <Link 
                        href="/admin/dashboard" 
                        className="block px-8 py-4 text-[12px] font-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all mb-2"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link href="/dashboard" className="block px-8 py-4 text-[12px] font-black text-zinc-400 hover:text-black dark:hover:text-white transition-all">
                      Order History
                    </Link>

                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left px-8 py-4 text-[12px] font-black text-red-500 hover:bg-red-500 hover:text-white transition-all mt-6"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[12px] font-black tracking-[0.4em] hover:opacity-70 transition-opacity border-2 border-black dark:border-white px-6 py-2">
                Log In
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-black dark:text-white"
            >
              <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t-4 border-black dark:border-white py-12 space-y-10 bg-white dark:bg-black h-screen fixed inset-x-0 top-24 px-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-4xl font-bold tracking-tighter text-black dark:text-white uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
