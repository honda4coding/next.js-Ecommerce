'use server';

import { auth } from "@/src/auth";
import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: { name: string; email: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  await dbConnect();
  try {
    const existingUser = await User.findOne({ email: formData.email, _id: { $ne: session.user.id } });
    if (existingUser) return { success: false, error: 'Email already in use' };

    await User.findByIdAndUpdate(session.user.id, {
      name: formData.name,
      email: formData.email,
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleUserRole(id: string, role: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') return { success: false, error: 'Unauthorized' };

  await dbConnect();
  try {
    await User.findByIdAndUpdate(id, { role });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') return { success: false, error: 'Unauthorized' };

  await dbConnect();
  try {
    await User.findByIdAndUpdate(id, { isActive: !isActive });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
