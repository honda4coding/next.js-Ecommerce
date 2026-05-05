import Link from "next/link";
import { getFeaturedProducts } from "@/src/actions/productActions";
import ProductCard from "@/src/components/ProductCard";
import NewsletterSection from "@/src/components/NewsletterSection";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  await dbConnect();
  const categories = await Category.find().limit(3).lean();

  return (
    <div className="flex flex-col flex-1 w-full bg-white dark:bg-black">
      
      <section className="relative h-[90vh] flex items-center justify-center border-b-4 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[11px] font-black tracking-[0.5em] text-zinc-400 uppercase mb-4">
            ESTABLISHED 2024
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.8] uppercase">
            PURE <br />
            TECHNOLOGY.
          </h1>
          <p className="max-w-lg mx-auto text-zinc-500 mb-12 text-sm leading-relaxed uppercase tracking-wide">
            A curated collection of essential electronics for the modern era. Designed for longevity and performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black text-[11px] font-black tracking-widest hover:opacity-80 transition-opacity uppercase"
            >
              SHOP COLLECTION
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <h2 className="text-4xl font-bold tracking-tighter uppercase">FEATURED</h2>
          <Link href="/products" className="text-[11px] font-black text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
            VIEW ALL PRODUCTS
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 border-4 border-black dark:border-white text-center uppercase tracking-widest text-zinc-400 text-xs">
            Catalog empty.
          </div>
        )}
      </section>

      <section className="py-32 border-t-4 border-black dark:border-white bg-white dark:bg-black w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <Link 
                key={cat._id} 
                href={`/products?category=${cat.slug}`}
                className="group border-4 border-black dark:border-white p-12 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <h3 className="text-2xl font-bold tracking-tighter uppercase mb-2">{cat.name}</h3>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
                  EXPLORE CATEGORY →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
