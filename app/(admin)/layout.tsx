import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-black w-full overflow-hidden">
      <div className="w-72 border-r border-zinc-100 dark:border-zinc-900 flex-col hidden lg:flex shrink-0">
        <div className="p-12">
          <Link href="/admin/dashboard" className="text-2xl font-bold tracking-tighter uppercase block break-words">
            ADMIN <span className="text-zinc-400">PANEL</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-8 space-y-1">
          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-6 px-4">MAIN MENU</p>
          
          {[
            { label: 'DASHBOARD', href: '/admin/dashboard' },
            { label: 'PRODUCTS', href: '/admin/products' },
            { label: 'CATEGORIES', href: '/admin/categories' },
            { label: 'ORDERS', href: '/admin/orders' },
            { label: 'USERS', href: '/admin/users' },
            { label: 'ALERTS', href: '/admin/alerts' },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all border-l-2 border-transparent hover:border-black dark:hover:border-white"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-12 mt-12 border-t border-zinc-50 dark:border-zinc-900">
            <Link href="/" className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:opacity-70 transition-opacity">
              ← BACK TO STORE
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 flex items-center justify-between px-4 sm:px-12 border-b border-zinc-50 dark:border-zinc-900 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] hidden sm:block">SYSTEM ONLINE</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest">{session.user?.name}</p>
              <p className="text-[9px] text-zinc-400 uppercase tracking-tighter">{session.user?.email}</p>
            </div>
            <div className="h-10 w-10 border border-zinc-100 dark:border-zinc-900 flex items-center justify-center text-xs font-bold bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                session.user?.name?.[0]
              )}
            </div>
          </div>
        </header>

        <div className="lg:hidden w-full border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black overflow-x-auto whitespace-nowrap sticky top-20 z-30 shrink-0">
          <nav className="flex items-center px-2">
            {[
              { label: 'DASHBOARD', href: '/admin/dashboard' },
              { label: 'PRODUCTS', href: '/admin/products' },
              { label: 'CATEGORIES', href: '/admin/categories' },
              { label: 'ORDERS', href: '/admin/orders' },
              { label: 'USERS', href: '/admin/users' },
              { label: 'ALERTS', href: '/admin/alerts' },
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="inline-block px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-black dark:hover:border-white transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
