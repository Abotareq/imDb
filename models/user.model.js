import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
export default mongoose.model("User", userSchema);
