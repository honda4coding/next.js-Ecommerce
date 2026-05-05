import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;
