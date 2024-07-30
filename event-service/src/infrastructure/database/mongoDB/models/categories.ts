import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string; 
  isBlocked?: boolean
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  isBlocked: {type: Boolean, default:false}
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', CategorySchema);
