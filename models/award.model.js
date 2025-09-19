import mongoose from "mongoose";

const awardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    category: { type: String, required: true }, 
    year: Number,
    entity: { type: mongoose.Schema.Types.ObjectId, ref: "Entity" },
    person: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  },
  { timestamps: true }
);

export default mongoose.model("Award", awardSchema);
