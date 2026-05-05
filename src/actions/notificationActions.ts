'use server';

import { auth } from '@/src/auth';
import dbConnect from '@/src/lib/dbConnect';
import Notification from '@/src/models/Notification';
import { revalidatePath } from 'next/cache';

export async function sendNotification(data: { title: string; message: string; type: string }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();

  try {
    const notification = new Notification(data);
    await notification.save();
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNotifications() {
  await dbConnect();
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5).lean();
    return JSON.parse(JSON.stringify(notifications));
  } catch (err) {
    return [];
  }
}

export async function markAsRead(id: string) {
  await dbConnect();
  await Notification.findByIdAndUpdate(id, { isRead: true });
  revalidatePath('/');
}

export async function markAllAsRead() {
  await dbConnect();
  await Notification.updateMany({ isRead: false }, { isRead: true });
  revalidatePath('/');
  return { success: true };
}


export async function getAllNotifications() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  await dbConnect();
  const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(notifications));
}

export async function deleteNotification(id: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  await dbConnect();
  await Notification.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/');
  return { success: true };
}

export async function deleteAllNotifications() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  await dbConnect();
  await Notification.deleteMany({});
  revalidatePath('/');
  return { success: true };
}

