import mongoose, { Document, Schema } from 'mongoose';

export interface ISwapRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  offerItemId?: mongoose.Types.ObjectId;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  },
  offerItemId: {
    type: Schema.Types.ObjectId,
    ref: 'ClothingItem'
  },
  pointsOffered: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
swapRequestSchema.index({ fromUserId: 1 });
swapRequestSchema.index({ toUserId: 1 });
swapRequestSchema.index({ itemId: 1 });
swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ createdAt: -1 });

export default mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema); 