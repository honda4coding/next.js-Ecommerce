'use server';

import { auth } from '@/src/auth';
import dbConnect from '@/src/lib/dbConnect';
import Product from '@/src/models/Product';
import User from '@/src/models/User';
import Category from '@/src/models/Category';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function createProduct(data: any) {
  await checkAdmin();
  await dbConnect();
  
  try {
    const product = new Product(data);
    await product.save();
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, message: 'Product created successfully' };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  await checkAdmin();
  await dbConnect();
  
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) throw new Error('Product not found');
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
    return { success: true, message: 'Product updated successfully' };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  await dbConnect();
  
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, message: 'Product deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(id: string, role: string) {
  await checkAdmin();
  await dbConnect();
  
  try {
    if (!['admin', 'customer'].includes(role)) {
      throw new Error('Invalid role');
    }
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw new Error('User not found');
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User role updated successfully' };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
}

export async function restrictUser(id: string) {
  await checkAdmin();
  await dbConnect();
  
  try {
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) throw new Error('User not found');
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User restricted successfully' };
  } catch (error: any) {
    console.error('Error restricting user:', error);
    return { success: false, error: error.message };
  }
}

export async function restoreUser(id: string) {
  await checkAdmin();
  await dbConnect();
  
  try {
    const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!user) throw new Error('User not found');
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User restored successfully' };
  } catch (error: any) {
    console.error('Error restoring user:', error);
    return { success: false, error: error.message };
  }
}


export async function createCategory(name: string, description: string) {
  await checkAdmin();
  await dbConnect();

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = new Category({ name, slug, description });
    await category.save();
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { success: true, message: 'Category created' };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, name: string, description: string) {
  await checkAdmin();
  await dbConnect();

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.findByIdAndUpdate(id, { name, slug, description }, { new: true });
    if (!category) throw new Error('Category not found');
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { success: true, message: 'Category updated' };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  await dbConnect();

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found');
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { success: true, message: 'Category deleted' };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}

