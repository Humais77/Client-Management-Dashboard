import mongoose, { Document, Schema, Types } from "mongoose";

export type ProjectStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface IProject extends Document {
  user: Types.ObjectId;
  client: Types.ObjectId;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Project = mongoose.model<IProject>(
  "Project",
  projectSchema
);