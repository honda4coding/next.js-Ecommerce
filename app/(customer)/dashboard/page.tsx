import { auth } from "@/src/auth";
import dbConnect from "@/src/lib/dbConnect";
import Order from "@/src/models/Order";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  await dbConnect();
  const orders = await Order.find({
    $or: [{ user: session.user?.id }, { guestEmail: session.user?.email }]
  }).sort({ createdAt: -1 }).lean();

  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-24 bg-white dark:bg-black min-h-screen overflow-hidden w-full">
      
      <div className="mb-12 sm:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-black dark:border-white pb-8 sm:pb-12 gap-6">
        <div className="w-full">
          <h1 className="text-4xl sm:text-7xl font-bold tracking-tighter uppercase mb-2 leading-none break-words">TERMINAL</h1>
          <p className="text-[10px] sm:text-[11px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.6em] break-words">Member Access & Log</p>
        </div>
        <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
           <Link href="/profile" className="inline-block w-full sm:w-auto text-center text-[11px] font-black uppercase tracking-widest border-2 border-black dark:border-white px-6 sm:px-10 py-4 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
             EDIT_PROFILE
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-3 space-y-16">
           <div className="space-y-12">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">IDENTIFIER</p>
                <p className="text-2xl font-bold uppercase tracking-tighter leading-none">{session.user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">EMAIL_LINK</p>
                <p className="text-sm font-bold uppercase tracking-tight">{session.user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">STATUS</p>
                <span className="text-[11px] font-black bg-black dark:bg-white text-white dark:text-black px-4 py-1 tracking-[0.3em] uppercase">
                  {(session.user as any)?.role || 'CUSTOMER'}
                </span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-9">
           <div className="mb-8 sm:mb-16">
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tighter uppercase break-words">TRANSACTION_HISTORY</h3>
              <p className="text-[10px] sm:text-[11px] font-black text-zinc-400 uppercase tracking-widest sm:tracking-[0.4em] mt-2 break-words">{serializedOrders.length} ENTRIES LOGGED</p>
           </div>

           <div className="space-y-16">
              {serializedOrders.length > 0 ? (
                serializedOrders.map((order: any) => (
                  <div key={order._id} className="group border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
                    <div className="px-6 py-6 sm:px-10 sm:py-8 border-b-2 border-black dark:border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-12 bg-white dark:bg-black">
                       <div className="flex flex-col sm:flex-row gap-6 sm:gap-16">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">TIMESTAMP</p>
                            <p className="text-sm font-bold uppercase tracking-tighter">
                               {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">MANIFEST_ID</p>
                            <p className="text-sm font-bold font-mono tracking-tighter uppercase">#{order._id.slice(-8)}</p>
                          </div>
                       </div>
                       <div>
                          <span className="text-[11px] font-black border-2 border-black dark:border-white px-6 py-2 uppercase tracking-[0.2em]">
                            {order.status}
                          </span>
                       </div>
                    </div>

                    <div className="p-6 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
                       <div className="flex items-center gap-6 sm:gap-10">
                          <div className="flex -space-x-4 sm:-space-x-6">
                             {order.items.slice(0, 3).map((item: any, i: number) => (
                               <div key={i} className="h-12 w-12 sm:h-20 sm:w-20 border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden transition-all">
                                  {item.image ? (
                                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-zinc-300">NULL</div>
                                  )}
                               </div>
                             ))}
                          </div>
                          <div>
                            <p className="text-lg font-bold uppercase tracking-tighter mb-1">{order.items.length} UNIT(S)</p>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest line-clamp-1 max-w-[200px]">
                               {order.items.map((it: any) => it.name).join(' // ')}
                            </p>
                          </div>
                       </div>

                       <div className="md:text-right space-y-4">
                          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mt-6 md:mt-0">GROSS_VALUATION</p>
                          <p className="text-3xl sm:text-5xl font-bold tracking-tighter text-black dark:text-white leading-none break-all">${order.totalAmount.toFixed(2)}</p>
                          <div className="pt-4 sm:pt-6">
                             <span className={`text-[11px] font-black uppercase tracking-[0.3em] px-4 py-1.5 border-2 ${
                               (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
                             }`}>
                               {(order.paymentStatus === 'paid' || order.paymentStatus === 'completed') ? '● PAID' : '○ UNPAID'}
                             </span>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 text-center border-4 border-dashed border-black dark:border-white">
                  <p className="text-xl font-black text-zinc-300 uppercase tracking-[0.5em]">EMPTY_LOG</p>
                  <Link href="/products" className="text-[11px] font-black uppercase tracking-widest mt-12 inline-block border-b-2 border-black dark:border-white pb-2 hover:opacity-50 transition-all">START ACQUISITION</Link>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}