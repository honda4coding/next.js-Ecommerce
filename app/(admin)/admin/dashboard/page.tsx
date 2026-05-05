import { auth } from "@/src/auth";
import dbConnect from "@/src/lib/dbConnect";
import Order from "@/src/models/Order";
import Product from "@/src/models/Product";
import User from "@/src/models/User";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  await dbConnect();
  
  const [orderCount, productCount, userCount, orders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  const stats = [
    { label: 'Revenue', value: `$${orders.reduce((acc: number, o: any) => acc + o.totalAmount, 0).toFixed(2)}` },
    { label: 'Total Orders', value: orderCount },
    { label: 'Products', value: productCount },
    { label: 'Total Users', value: userCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-12 sm:py-16 bg-white dark:bg-black min-h-screen">
      <div className="mb-12 sm:mb-24 border-b-4 border-black dark:border-white pb-6 sm:pb-12">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase mb-4 break-words">Admin Dashboard</h1>
        <p className="text-[11px] font-black text-black dark:text-white uppercase tracking-[0.5em] opacity-40">Overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black dark:bg-white border-2 border-black dark:border-white mb-24">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-black p-6 sm:p-12">
            <p className="text-[10px] font-black text-zinc-400 mb-2 sm:mb-6 uppercase tracking-[0.3em]">{stat.label}</p>
            <span className="text-3xl sm:text-5xl font-bold tracking-tighter uppercase leading-none break-all">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
        <div className="px-12 py-8 border-b-2 border-black dark:border-white">
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-black text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b-2 border-black dark:border-white">
              <tr>
                <th className="px-4 py-4 sm:px-12 sm:py-6 whitespace-nowrap">Order ID</th>
                <th className="px-4 py-4 sm:px-12 sm:py-6 whitespace-nowrap">Customer</th>
                <th className="px-4 py-4 sm:px-12 sm:py-6 whitespace-nowrap">Items</th>
                <th className="px-4 py-4 sm:px-12 sm:py-6 text-right whitespace-nowrap">Total</th>
                <th className="px-4 py-4 sm:px-12 sm:py-6 text-center whitespace-nowrap">Payment</th>
                <th className="px-4 py-4 sm:px-12 sm:py-6 text-right whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black dark:divide-white">
              {orders.map((order: any) => (
                <tr key={order._id.toString()} className="hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
                  <td className="px-4 py-4 sm:px-12 sm:py-8 text-sm font-mono font-black tracking-tighter uppercase whitespace-nowrap">#{order._id.toString().slice(-8)}</td>
                  <td className="px-4 py-4 sm:px-12 sm:py-8 text-[11px] font-bold uppercase tracking-tight truncate max-w-[150px] whitespace-nowrap">{order.guestEmail || 'Registered User'}</td>
                  <td className="px-4 py-4 sm:px-12 sm:py-8 whitespace-nowrap">
                    <div className="flex -space-x-4">
                      {order.items?.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden transition-all">
                           {item.image ? <img src={item.image} className="h-full w-full object-cover" alt="" /> : <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-zinc-400">N/A</div>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-12 sm:py-8 text-right font-black text-lg tracking-tighter whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4 sm:px-12 sm:py-8 text-center whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-2 ${
                      (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
                    }`}>
                      {(order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-12 sm:py-8 text-right text-[11px] font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap">
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
