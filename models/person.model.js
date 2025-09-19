import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: String,
  dateOfBirth: Date,
  photoUrl: String,

  roles: [{ type: String, enum: ["actor", "director", "writer"] }],

  entities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entity" }]
}, { timestamps: true });

export default mongoose.model("Person", personSchema);
