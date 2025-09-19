import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entity: { type: mongoose.Schema.Types.ObjectId, ref: "Entity", required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String, maxlength: 1000 }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
