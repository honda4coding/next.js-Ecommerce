'use server';

import { auth } from '@/src/auth';
import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import Product from '@/src/models/Product';
import Notification from '@/src/models/Notification';
import { revalidatePath } from 'next/cache';

export async function placeOrderCOD(data: {
  items: any[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}) {
  try {
    const session = await auth();
    await dbConnect();

    const orderItems = data.items.map((item: any) => ({
      product: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image || '',
    }));

    const newOrder = new Order({
      user: session?.user?.id || undefined,
      guestEmail: !session ? 'Guest' : undefined, 
      items: orderItems,
      totalAmount: data.totalAmount,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress: data.shippingAddress,
    });

    await newOrder.save();

    await Notification.create({
      title: 'NEW_COD_ORDER',
      message: `NEW ACQUISITION DETECTED: ORDER_${newOrder._id.toString().slice(-6).toUpperCase()} VALUED AT $${data.totalAmount.toFixed(2)}`,
      type: 'order'
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');
    
    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    console.error('COD Order Error:', error);
    return { success: false, error: error.message };
  }
}
