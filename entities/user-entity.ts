import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  role: mongoose.Schema.Types.ObjectId;
}

/**
 * @description The user schema for the database.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {mongoose.Schema.Types.ObjectId} role - The role of the user.
 * @property {Date} createdAt - The date the user was created.
 * @property {Date} updatedAt - The date the user was updated.
 */
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
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true },
);

const UserEntity =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
export default UserEntity;
