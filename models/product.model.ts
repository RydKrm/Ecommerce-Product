import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  productName: String;
  price: Number;
  category: String;
  description: String;
}

const userSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

export const Product = mongoose.model<IProduct>("Product", userSchema);
