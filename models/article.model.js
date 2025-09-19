import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  relatedEntity: { type: mongoose.Schema.Types.ObjectId, ref: "Entity" }
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
