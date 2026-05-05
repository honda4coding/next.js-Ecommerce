import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import OrderManager from '@/src/components/admin/OrderManager';

export default async function AdminOrdersPage() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(orders));

  return <OrderManager initialOrders={serialized} />;
}
