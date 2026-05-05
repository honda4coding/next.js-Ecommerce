import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import Product from '@/src/models/Product';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const userPassword = await bcrypt.hash('userpassword', 10);

    await User.insertMany([
      { name: 'Admin Account', email: 'admin@admin.com', password: hashedPassword, role: 'admin' },
      { name: 'Test User', email: 'user@user.com', password: userPassword, role: 'customer' },
    ]);

    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
      { name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture and decor' },
      { name: 'Sports', slug: 'sports', description: 'Sports and outdoors' },
      { name: 'Accessories', slug: 'accessories', description: 'Watches, bags, and more' },
    ]);

    const products = await Product.insertMany([
      {
        name: 'Wireless Noise-Canceling Headphones',
        slug: 'wireless-noise-canceling-headphones',
        description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
        price: 299.99,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
        category: categories[0]._id,
        stock: 50,
        featured: true,
      },
      {
        name: 'Smart Home Hub',
        slug: 'smart-home-hub',
        description: 'Control all your smart devices from one central hub with voice assistant integration.',
        price: 129.99,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop'],
        category: categories[0]._id,
        stock: 100,
        featured: false,
      },
      {
        name: '4K Ultra HD Action Camera',
        slug: '4k-action-camera',
        description: 'Capture your adventures in stunning 4K resolution. Waterproof up to 30m.',
        price: 199.99,
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop'],
        category: categories[0]._id,
        stock: 75,
        featured: true,
      },
      {
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-t-shirt',
        description: 'Comfortable, breathable 100% organic cotton t-shirt available in multiple colors.',
        price: 24.99,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'],
        category: categories[1]._id,
        stock: 200,
        featured: true,
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic straight-leg denim jeans with a comfortable stretch.',
        price: 59.99,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop'],
        category: categories[1]._id,
        stock: 150,
        featured: false,
      },
      {
        name: 'Winter Puffer Jacket',
        slug: 'winter-puffer-jacket',
        description: 'Stay warm with this insulated, water-resistant puffer jacket.',
        price: 120.00,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'],
        category: categories[1]._id,
        stock: 40,
        featured: true,
      },
      {
        name: 'Modern Coffee Table',
        slug: 'modern-coffee-table',
        description: 'Minimalist wooden coffee table with a tempered glass top.',
        price: 199.99,
        images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=1000&auto=format&fit=crop'],
        category: categories[2]._id,
        stock: 20,
        featured: true,
      },
      {
        name: 'Ceramic Plant Pot',
        slug: 'ceramic-plant-pot',
        description: 'Handcrafted ceramic pot perfect for indoor plants.',
        price: 34.99,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop'],
        category: categories[2]._id,
        stock: 80,
        featured: true,
      },
      {
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        description: 'Adjustable LED desk lamp with touch controls and 3 brightness levels.',
        price: 45.00,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop'],
        category: categories[2]._id,
        stock: 60,
        featured: false,
      },
      {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Eco-friendly, non-slip yoga mat with alignment lines.',
        price: 29.99,
        images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1000&auto=format&fit=crop'],
        category: categories[3]._id,
        stock: 120,
        featured: true,
      },
      {
        name: 'Adjustable Dumbbells',
        slug: 'adjustable-dumbbells',
        description: 'Space-saving adjustable dumbbells, from 5 to 52.5 lbs.',
        price: 350.00,
        images: ['https://images.unsplash.com/photo-1586401700868-232cc220e835?q=80&w=1000&auto=format&fit=crop'],
        category: categories[3]._id,
        stock: 15,
        featured: true,
      },
      {
        name: 'Leather Watch',
        slug: 'leather-watch',
        description: 'Classic analog watch with a genuine leather strap.',
        price: 150.00,
        images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'],
        category: categories[4]._id,
        stock: 45,
        featured: true,
      },
      {
        name: 'Polarized Sunglasses',
        slug: 'polarized-sunglasses',
        description: 'UV400 polarized sunglasses with a durable, lightweight frame.',
        price: 85.00,
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop'],
        category: categories[4]._id,
        stock: 90,
        featured: false,
      }
    ]);

    return NextResponse.json({ message: 'Database seeded successfully!', products, categories });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
