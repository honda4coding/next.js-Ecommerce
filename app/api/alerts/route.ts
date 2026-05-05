import { NextResponse } from 'next/server';
import { getNotifications, sendNotification } from '@/src/actions/notificationActions';

export async function GET() {
  try {
    const notifications = await getNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    const notificationData = {
      title: data.title || 'SYSTEM ALERT',
      message: data.message,
      type: data.type || 'system'
    };
    
    const result = await sendNotification(notificationData);
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
