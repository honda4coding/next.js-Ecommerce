import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t-4 border-black dark:border-white py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-4xl font-bold tracking-tighter mb-8 block">ESHOP.</Link>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] leading-[2.5] max-w-sm">
              MINIMAL_AESTHETICS <br />
              HIGH_END_PERFORMANCE <br />
              GLOBAL_LOGISTICS_NETWORK
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] mb-8 border-b-2 border-black dark:border-white pb-2 inline-block">DIRECTORY</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">COLLECTIONS</Link></li>
              <li><Link href="/categories" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">TAXONOMY</Link></li>
              <li><Link href="#" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">MEMORANDUM</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] mb-8 border-b-2 border-black dark:border-white pb-2 inline-block">ASSISTANCE</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">PROTOCOL</Link></li>
              <li><Link href="#" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">LEGAL_FRAMEWORK</Link></li>
              <li><Link href="#" className="text-[11px] font-black text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">DATA_PRIVACY</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-16 border-t-4 border-black dark:border-white gap-8">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black">
            © {currentYear} ESHOP // ALL_RIGHTS_RESERVED
          </p>
          <div className="flex gap-12">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black">LONDON</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black">CAIRO</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black">TOKYO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
