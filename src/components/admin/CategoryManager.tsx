'use client';

import { useState } from 'react';
import { createCategory, deleteCategory } from '@/src/actions/productActions';

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCategory(name);
      if (res.success) {
        setCategories([...categories, res.category]);
        setName('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-16 gap-6">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2 leading-none break-words">Categories</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] mt-4 break-words">Manage your product categories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-6 py-4 md:px-12 md:py-6 text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:opacity-80 transition-all shrink-0"
        >
          Add Category
        </button>
      </div>

      <div className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-black border-b-4 border-black dark:border-white text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="px-4 py-4 md:px-10 md:py-8 whitespace-nowrap">Category Name</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-center whitespace-nowrap">Slug</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black dark:divide-white">
            {categories.map((category: any) => (
              <tr key={category._id} className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <td className="px-4 py-6 md:px-10 md:py-10 font-black text-lg md:text-2xl tracking-tighter uppercase whitespace-nowrap">{category.name}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-center text-xs font-mono font-bold uppercase whitespace-nowrap">{category.slug}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-right whitespace-nowrap">
                  <button 
                    onClick={() => handleDelete(category._id)}
                    className="text-[12px] font-black text-red-500 uppercase tracking-widest border-b-2 border-red-500 pb-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 sm:p-16 w-full max-w-3xl my-auto animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black dark:border-white pb-4 inline-block">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
              <div className="space-y-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Category Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-2xl md:text-4xl font-black uppercase focus:outline-none"
                  placeholder="e.g. Shoes"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-8 md:pt-12">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-6 md:py-10 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 sm:px-20 py-6 md:py-10 border-4 border-black dark:border-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
