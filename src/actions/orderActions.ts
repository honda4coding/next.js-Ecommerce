'use server';

import { auth } from '@/src/auth';
import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status' };
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return { success: false, error: 'Order not found' };

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
