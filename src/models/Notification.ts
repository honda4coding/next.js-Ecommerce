import mongoose, { Schema, models, model } from 'mongoose';

const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['promo', 'order', 'system'], 
    default: 'promo' 
  },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = models.Notification || model('Notification', NotificationSchema);
export default Notification;
