import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Newsletter from '@/src/models/Newsletter';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await dbConnect();

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });
    return NextResponse.json({ message: 'Successfully subscribed!' });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
