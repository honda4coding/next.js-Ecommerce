import dbConnect from '@/src/lib/dbConnect';
import User from '@/src/models/User';
import UserManager from '@/src/components/admin/UserManager';

export default async function AdminUsersPage() {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  const serializedUsers = JSON.parse(JSON.stringify(users));

  return <UserManager initialUsers={serializedUsers} />;
}
