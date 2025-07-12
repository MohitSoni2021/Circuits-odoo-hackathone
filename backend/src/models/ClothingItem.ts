import mongoose, { Document, Schema } from 'mongoose';

export interface IClothingItem extends Document {
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploaderId: mongoose.Types.ObjectId;
  uploaderName: string;
  pointsRequired: number;
  status: 'available' | 'pending' | 'swapped';
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clothingItemSchema = new Schema<IClothingItem>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Excellent', 'Good', 'Fair', 'Poor']
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    required: true
  }],
  uploaderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderName: {
    type: String,
    required: true,
    trim: true
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'swapped'],
    default: 'pending'
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
clothingItemSchema.index({ uploaderId: 1 });
clothingItemSchema.index({ status: 1 });
clothingItemSchema.index({ approved: 1 });
clothingItemSchema.index({ category: 1 });
clothingItemSchema.index({ createdAt: -1 });

export default mongoose.model<IClothingItem>('ClothingItem', clothingItemSchema); 