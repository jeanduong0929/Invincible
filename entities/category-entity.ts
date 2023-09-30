import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  name: string;
}

const categorySchema = new mongoose.Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const CategoryEntity =
  mongoose.models.Category ||
  mongoose.model<CategoryDocument>("Category", categorySchema);
export default CategoryEntity;
