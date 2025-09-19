import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,

  actor: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },

  entity: { type: mongoose.Schema.Types.ObjectId, ref: "Entity", required: true }
}, { timestamps: true });

export default mongoose.model("Character", characterSchema);
