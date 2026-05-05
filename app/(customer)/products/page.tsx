import { getProducts, getCategories } from '@/src/actions/productActions';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';
import Form from 'next/form';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const sp = await searchParams;
  const query = sp?.q || '';
  const categorySlug = sp?.category || '';
  const minPrice = sp?.minPrice || '';
  const maxPrice = sp?.maxPrice || '';

  const products = await getProducts(query, categorySlug, minPrice, maxPrice);
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex flex-col md:flex-row gap-16 bg-white dark:bg-black">
      
      <div className="w-full md:w-72 flex-shrink-0 space-y-16">
        <div className="space-y-10">
          <h3 className="text-[12px] font-black tracking-[0.3em] uppercase border-b-4 border-black dark:border-white pb-2">Filters</h3>
          
          <Form className="space-y-10" action="/products" replace>
            <div className="space-y-3">
              <label htmlFor="search" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Search</label>
              <input
                type="text"
                name="q"
                id="search"
                defaultValue={query}
                placeholder="Search products..."
                className="w-full bg-transparent border-b-4 border-black dark:border-white py-3 text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price Range ($)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={minPrice}
                  placeholder="Min"
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-3 text-sm font-bold focus:outline-none"
                />
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice}
                  placeholder="Max"
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-3 text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

            <button type="submit" className="w-full py-5 bg-black dark:bg-white text-white dark:text-black text-[11px] font-black tracking-widest uppercase hover:opacity-80 transition-opacity">
              Apply Filters
            </button>

            {(query || categorySlug || minPrice || maxPrice) && (
              <Link href="/products" className="block text-center text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest border-b-2 border-zinc-200 dark:border-zinc-800 pb-1">
                Reset All
              </Link>
            )}
          </Form>
        </div>

        <div className="space-y-8 pt-16 border-t-4 border-black dark:border-white">
          <h4 className="text-[12px] font-black tracking-[0.3em] uppercase">Categories</h4>
          <ul className="space-y-6">
            <li>
              <Link
                href={`/products${query ? `?q=${query}` : ''}${minPrice ? `${query ? '&' : '?'}minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                className={`text-[11px] font-black tracking-widest uppercase transition-colors ${!categorySlug ? 'border-b-2 border-black dark:border-white' : 'text-zinc-400 hover:text-black dark:hover:text-white'}`}
              >
                ALL CATEGORIES
              </Link>
            </li>
            {categories.map((cat: any) => (
              <li key={cat._id}>
                <Link
                  href={`/products?category=${cat.slug}${query ? `&q=${query}` : ''}${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={`text-[11px] font-black tracking-widest uppercase transition-colors ${categorySlug === cat.slug ? 'border-b-2 border-black dark:border-white' : 'text-zinc-400 hover:text-black dark:hover:text-white'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-end mb-16 border-b-4 border-black dark:border-white pb-4">
          <h1 className="text-5xl font-bold tracking-tighter uppercase">
            {query ? `Search: ${query}` : 'Products'}
          </h1>
          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pb-1">{products.length} Items</span>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-48 border-4 border-dashed border-zinc-200 dark:border-zinc-800 text-center uppercase tracking-[0.5em] text-zinc-400 text-[10px] font-black">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
