import mongoose from "mongoose";

export interface CartItemDocument extends mongoose.Document {
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  product: mongoose.Schema.Types.ObjectId;
  cart: mongoose.Schema.Types.ObjectId;
}

const cartItemSchema = new mongoose.Schema<CartItemDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  },
  { timestamps: true },
);

const CartItemEntity =
  mongoose.models.CartItem ||
  mongoose.model<CartItemDocument>("CartItem", cartItemSchema);
export default CartItemEntity;
