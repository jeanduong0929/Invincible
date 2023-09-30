import mongoose from "mongoose";

export interface AccountDocument extends mongoose.Document {
  providerId: string;
  providerType: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const accountSchema = new mongoose.Schema<AccountDocument>(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    providerType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const AccountEntity =
  mongoose.models.Account ||
  mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountEntity;
