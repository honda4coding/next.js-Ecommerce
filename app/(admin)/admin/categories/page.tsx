import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import CategoryManager from '@/src/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  await dbConnect();
  const categories = await Category.find().sort({ name: 1 }).lean();
  const serialized = JSON.parse(JSON.stringify(categories));

  return <CategoryManager initialCategories={serialized} />;
}
