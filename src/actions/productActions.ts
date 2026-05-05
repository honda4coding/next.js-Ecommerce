'use server';

import dbConnect from '@/src/lib/dbConnect';
import Product from '@/src/models/Product';
import Category from '@/src/models/Category';
import { revalidatePath } from 'next/cache';
import { auth } from '@/src/auth';

async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function getFeaturedProducts() {
  await dbConnect();
  const products = await Product.find({ featured: true }).populate('category').limit(4).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProducts(query = '', categorySlug = '', minPrice = '', maxPrice = '') {
  await dbConnect();
  const filter: any = {};
  if (query) filter.name = { $regex: query, $options: 'i' };
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (category) filter.category = category._id;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug: string) {
  await dbConnect();
  const product = await Product.findOne({ slug }).populate('category').lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getCategories() {
  await dbConnect();
  const categories = await Category.find().lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function createProduct(data: any) {
  await checkAdmin();
  await dbConnect();
  const product = await Product.create({ ...data, slug: data.name.toLowerCase().replace(/ /g, '-') });
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: true, product: JSON.parse(JSON.stringify(product)) };
}

export async function updateProduct(id: string, data: any) {
  await checkAdmin();
  await dbConnect();
  const product = await Product.findByIdAndUpdate(id, data, { new: true }).populate('category');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: true, product: JSON.parse(JSON.stringify(product)) };
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  await dbConnect();
  await Product.findByIdAndDelete(id);
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: true };
}

export async function createCategory(name: string) {
  await checkAdmin();
  await dbConnect();
  const slug = name.toLowerCase().replace(/ /g, '-');
  const category = await Category.create({ name, slug });
  revalidatePath('/admin/categories');
  return { success: true, category: JSON.parse(JSON.stringify(category)) };
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath('/admin/categories');
  return { success: true };
}
