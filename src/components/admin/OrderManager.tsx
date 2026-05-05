'use client';

import { useState, useEffect } from 'react';
import { updateOrderStatus } from '@/src/actions/orderActions';

export default function OrderManager({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) { console.error(err); }
    finally { setLoadingId(null); }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-16 gap-6">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2 break-words">Orders</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.5em] break-words">Manage transactions</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block">{orders.length} Orders Found</span>
        </div>
      </div>

      <div className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-black border-b-4 border-black dark:border-white text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <tr>
                <th className="px-4 py-4 md:px-10 md:py-6 whitespace-nowrap">Order ID</th>
                <th className="px-4 py-4 md:px-10 md:py-6 whitespace-nowrap">Customer</th>
                <th className="px-4 py-4 md:px-10 md:py-6 text-right whitespace-nowrap">Total</th>
                <th className="px-4 py-4 md:px-10 md:py-6 text-center whitespace-nowrap">Payment</th>
                <th className="px-4 py-4 md:px-10 md:py-6 text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-4 md:px-10 md:py-6 text-right whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black dark:divide-white">
              {orders.map((order: any) => (
                <tr key={order._id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors ${loadingId === order._id ? 'opacity-30' : ''}`}>
                  <td className="px-4 py-6 md:px-10 md:py-8 text-sm font-mono font-black tracking-tighter uppercase whitespace-nowrap">#{order._id.slice(-8)}</td>
                  <td className="px-4 py-6 md:px-10 md:py-8 whitespace-nowrap">
                    <p className="text-xs font-bold uppercase tracking-tight mb-1">{order.shippingAddress?.fullName || 'Guest'}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{order.guestEmail || 'User'}</p>
                  </td>
                  <td className="px-4 py-6 md:px-10 md:py-8 text-right font-black text-lg tracking-tighter whitespace-nowrap">${order.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-6 md:px-10 md:py-8 text-center whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-4 ${
                      (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
                    }`}>
                      {(order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-6 md:px-10 md:py-8 text-center whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      disabled={loadingId === order._id}
                      className="bg-transparent text-[11px] font-black uppercase tracking-widest border-4 border-black dark:border-white px-4 py-2 focus:outline-none appearance-none text-center cursor-pointer min-w-[140px]"
                    >
                      <option value="pending" className="bg-white dark:bg-black">Pending</option>
                      <option value="processing" className="bg-white dark:bg-black">Processing</option>
                      <option value="shipped" className="bg-white dark:bg-black">Shipped</option>
                      <option value="delivered" className="bg-white dark:bg-black">Delivered</option>
                      <option value="cancelled" className="bg-white dark:bg-black">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-6 md:px-10 md:py-8 text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-US')}
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
