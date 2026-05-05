import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;