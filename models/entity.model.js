import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: String
}, { timestamps: true });


const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodeNumber: { type: Number, required: true },
  description: String,
  releaseDate: Date,
  duration: Number, // in minutes
  thumbnailUrl: String
}, { timestamps: true });

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  description: String,
  posterUrl: String,
  coverUrl: String, // wide banner image for season
  rating: { type: Number, default: 0 },
  episodes: [episodeSchema]
}, { timestamps: true });

const entitySchema = new mongoose.Schema({
  type: { type: String, enum: ["movie", "tv"], required: true },

  title: { type: String, required: true, trim: true },
  description: String,

  releaseDate: Date,
  endDate: Date, 

  genres: [genreSchema], 

  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],

  seasons: [seasonSchema],

  
  posterUrl: String, 
  coverUrl: String,  

  rating: { type: Number, default: 0 } 
}, { timestamps: true });

export default mongoose.model("Entity", entitySchema);
