import mongoose from "mongoose";

export interface RoleDocument extends mongoose.Document {
  name: string;
}

/**
 * @description The role schema for the database.
 * @property {string} name - The name of the role.
 * @property {Date} createdAt - The date the role was created.
 * @property {Date} updatedAt - The date the role was updated.
 */
const roleScehma = new mongoose.Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const RoleEntity =
  mongoose.models.Role || mongoose.model<RoleDocument>("Role", roleScehma);
export default RoleEntity;
