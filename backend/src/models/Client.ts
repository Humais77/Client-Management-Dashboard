import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClient extends Document {
  user: Types.ObjectId;
  name: string;
  email: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    }
  },
  {
    timestamps: true
  }
);

export const Client = mongoose.model<IClient>("Client", clientSchema);