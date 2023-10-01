import mongoose from "mongoose";

export interface CartDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
}

const cartSchema = new mongoose.Schema<CartDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const CartEntity =
  mongoose.models.Cart || mongoose.model<CartDocument>("Cart", cartSchema);
export default CartEntity;
