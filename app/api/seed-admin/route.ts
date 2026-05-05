import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    const email = 'admin@admin.com';
    const password = 'adminpassword';

    const existingAdmin = await User.findOne({ email });
    
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      return NextResponse.json({ message: 'Admin role forced on existing user. You can log in with admin@admin.com / adminpassword' });
    }

    const admin = new User({
      name: 'System Admin',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    return NextResponse.json({ message: 'Admin account created successfully! You can log in with admin@admin.com / adminpassword' });
  } catch (error) {
    console.error('Error seeding admin:', error);
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 });
  }
}
