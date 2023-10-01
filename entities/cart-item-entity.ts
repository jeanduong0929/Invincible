import mongoose from "mongoose";

export interface CartItemDocument extends mongoose.Document {
  product: mongoose.Schema.Types.ObjectId;
  cart: mongoose.Schema.Types.ObjectId;
}

const cartItemSchema = new mongoose.Schema<CartItemDocument>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
