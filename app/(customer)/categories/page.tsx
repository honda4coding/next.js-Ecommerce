import Link from 'next/link';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import Product from '@/src/models/Product';

export default async function CategoriesPage() {
  await dbConnect();
  const allCategories = await Category.find().sort({ name: 1 }).lean();
  
  const categoriesWithCount = await Promise.all(allCategories.map(async (cat: any) => {
    try {
      const count = await Product.countDocuments({ category: cat._id });
      return { ...cat, _id: cat._id.toString(), productCount: count };
    } catch (err) {
      return { ...cat, _id: cat._id.toString(), productCount: 0 };
    }
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-white dark:bg-black min-h-screen">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6">CATEGORIES</h1>
        <p className="text-xs text-zinc-400 uppercase tracking-[0.5em] font-medium">DISCOVER THE COLLECTION BY TYPE.</p>
      </div>

      {categoriesWithCount.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCount.map((category) => (
            <Link 
              key={category._id} 
              href={`/products?category=${category.slug}`}
              className="group border border-zinc-100 dark:border-zinc-900 p-12 hover:border-black dark:hover:border-white transition-all flex flex-col items-center text-center"
            >
              <span className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                {category.name.toLowerCase().includes('phone') ? '📱' : 
                 category.name.toLowerCase().includes('laptop') ? '💻' : 
                 category.name.toLowerCase().includes('audio') ? '🎧' : '📦'}
              </span>
              <h3 className="text-2xl font-bold tracking-tighter uppercase mb-2">
                {category.name}
              </h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">
                {category.productCount} ITEMS
              </p>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:opacity-100 opacity-0 transition-opacity">
                VIEW COLLECTION →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-zinc-200 dark:border-zinc-800 uppercase tracking-widest text-zinc-400 text-xs">
          NO CATEGORIES FOUND.
        </div>
      )}
    </div>
  );
}
