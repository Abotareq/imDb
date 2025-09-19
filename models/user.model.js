import mongoose from "mongoose";
const watchlistSchema = new mongoose.Schema(
  {
    entities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entity" }],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    watchlist: [watchlistSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
