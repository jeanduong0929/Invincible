import mongoose from "mongoose";

export interface AccountDocument extends mongoose.Document {
  providerId: string;
  providerType: string;
  user: mongoose.Schema.Types.ObjectId;
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const AccountEntity =
  mongoose.models.Account ||
  mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountEntity;
