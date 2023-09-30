import mongoose from "mongoose";

export interface ProductDocument extends mongoose.Document {
  name: string;
  price: number;
  description: string;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ProductEntity =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", productSchema);
export default ProductEntity;
