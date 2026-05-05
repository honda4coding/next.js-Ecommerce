import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import Product from '@/src/models/Product';
import Notification from '@/src/models/Notification';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-04-22.dahlia' as any,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    }) as any;

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    await dbConnect();

    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder._id, alreadySaved: true });
    }

    const items = await Promise.all((session.line_items?.data || []).map(async (item: any) => {
      const productDoc = await Product.findOne({ name: item.description }).lean() as any;
      
      return {
        product: productDoc?._id || '000000000000000000000000', 
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100 / item.quantity,
        image: productDoc?.images?.[0] || '',
      };
    }));

    const shipping = session.shipping_details;
    const shippingAddress = {
      fullName: shipping?.name || session.customer_details?.name || 'N/A',
      address: shipping?.address?.line1 || 'N/A',
      city: shipping?.address?.city || 'N/A',
      postalCode: shipping?.address?.postal_code || 'N/A',
      country: shipping?.address?.country || 'N/A',
    };

    const newOrder = new Order({
      guestEmail: session.customer_details?.email,
      items,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      status: 'pending',
      paymentMethod: 'stripe',
      paymentStatus: 'paid',
      shippingAddress,
      stripeSessionId: sessionId,
    });

    await newOrder.save();

    await Notification.create({
      title: 'NEW_STRIPE_ORDER',
      message: `SECURE PAYMENT SUCCESSFUL: ORDER_${newOrder._id.toString().slice(-6).toUpperCase()} PROCESSED VIA STRIPE.`,
      type: 'order'
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (error: any) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
