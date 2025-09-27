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

    avatar: { type: String, default: "" },
    bio: { type: String, maxlength: 300 },
    verified: { type: Boolean, default: false },
    verifiedAt: {
      type: Date,
    },
    verificationNote: {
      type: String,
      maxlength: 200,
    },
    watchlist: [watchlistSchema],
    preferences: {
      type: Map,
      of: Number, // Store preference scores (e.g., genre: 0.8 or type: 0.9)
      default: {},
    },
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
