import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const UserEntity =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
export default UserEntity;
