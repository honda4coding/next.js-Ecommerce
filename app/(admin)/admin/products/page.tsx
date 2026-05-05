import dbConnect from '@/src/lib/dbConnect';
import Product from '@/src/models/Product';
import Category from '@/src/models/Category';
import ProductManager from '@/src/components/admin/ProductManager';

export default async function AdminProductsPage() {
  await dbConnect();
  
  const products = await Product.find().populate('category').sort({ createdAt: -1 }).lean();
  const categories = await Category.find().sort({ name: 1 }).lean();

  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <ProductManager initialProducts={serializedProducts} categories={serializedCategories} />
  );
}
