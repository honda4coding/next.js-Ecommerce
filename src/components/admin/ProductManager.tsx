'use client';

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct } from '@/src/actions/productActions';

export default function ProductManager({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: categories[0]?._id || '',
    stock: '',
    images: [''],
  });

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category?._id || product.category,
        stock: product.stock.toString(),
        images: product.images,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0]?._id || '',
        stock: '',
        images: [''],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, data);
        if (res.success) setProducts(products.map(p => p._id === editingProduct._id ? res.product : p));
      } else {
        const res = await createProduct(data);
        if (res.success) setProducts([res.product, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-16 gap-6">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2 leading-none break-words">Products</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] mt-4 break-words">Manage your inventory</p>
        </div>
        <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-6 py-4 md:px-12 md:py-6 text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:opacity-80 transition-all shrink-0">
          Add Product
        </button>
      </div>

      <div className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-black border-b-4 border-black dark:border-white text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="px-4 py-4 md:px-10 md:py-8 whitespace-nowrap">Image</th>
              <th className="px-4 py-4 md:px-10 md:py-8 whitespace-nowrap">Name</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-center whitespace-nowrap">Stock</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-right whitespace-nowrap">Price</th>
              <th className="px-4 py-4 md:px-10 md:py-8 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black dark:divide-white">
            {products.map((p: any) => (
              <tr key={p._id} className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <td className="px-4 py-6 md:px-10 md:py-10">
                  <div className="h-16 w-16 md:h-20 md:w-20 border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
                    {p.images?.[0] && <img src={p.images[0]} className="h-full w-full object-cover" />}
                  </div>
                </td>
                <td className="px-4 py-6 md:px-10 md:py-10 whitespace-nowrap">
                  <p className="font-black text-lg md:text-2xl tracking-tighter uppercase mb-1">{p.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{p.category?.name || 'Uncategorized'}</p>
                </td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-center text-lg font-black">{p.stock}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-right text-lg md:text-2xl font-black tracking-tighter">${p.price.toFixed(2)}</td>
                <td className="px-4 py-6 md:px-10 md:py-10 text-right space-x-4 md:space-x-8 whitespace-nowrap">
                  <button onClick={() => handleOpenModal(p)} className="text-[12px] font-black uppercase tracking-widest border-b-2 border-current pb-1">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-[12px] font-black text-red-500 uppercase tracking-widest border-b-2 border-red-500 pb-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 sm:p-16 w-full max-w-4xl my-auto animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black dark:border-white pb-4 inline-block">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                <div className="col-span-1 sm:col-span-2 space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-2xl md:text-4xl font-black uppercase focus:outline-none" placeholder="Product Name" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-xl md:text-3xl font-black focus:outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Stock Quantity</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-xl md:text-3xl font-black focus:outline-none" placeholder="0" />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-xl md:text-3xl font-black uppercase focus:outline-none appearance-none">
                    {categories.map(c => <option key={c._id} value={c._id} className="bg-white dark:bg-black">{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Image URL</label>
                  <input value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} className="w-full bg-transparent border-b-4 border-black dark:border-white py-4 md:py-6 text-xs font-mono focus:outline-none" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-8 md:pt-16">
                <button type="submit" disabled={loading} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-6 md:py-10 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all">
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 sm:px-20 py-6 md:py-10 border-4 border-black dark:border-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
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
