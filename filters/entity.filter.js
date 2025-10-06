/* ---------------------- FILTER MOVIES ---------------------- */
import Entity from "../models/entity.model.js";
export const filterMovies = async (req, res, next) => {
  try {
    const { genre, year, minRating, maxRating } = req.query;

    const filter = { type: "movie" };

    if (genre) {
      filter["genres.name"] = genre;
    }

    if (year) {
      filter.releaseDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    const movies = await Entity.find(filter).lean();

    res.json({ success: true, count: movies.length, movies });
  } catch (err) {
    next(err);
  }
};

/* ---------------------- FILTER TV ---------------------- */
export const filterTv = async (req, res, next) => {
  try {
    const { genre, startYear, endYear, minRating, maxRating } = req.query;

    const filter = { type: "tv" };

    if (genre) {
      filter["genres.name"] = genre;
    }

    if (startYear || endYear) {
      filter.releaseDate = {};
      if (startYear) filter.releaseDate.$gte = new Date(`${startYear}-01-01`);
      if (endYear) filter.releaseDate.$lte = new Date(`${endYear}-12-31`);
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    const tvShows = await Entity.find(filter)
      .populate("directors cast seasons.episodes")
      .lean();

    res.json({ success: true, count: tvShows.length, tvShows });
  } catch (err) {
    next(err);
  }
};
/* ---------------------- UNIVERSAL FILTER ---------------------- */
export const filterEntities = async (req, res, next) => {
  try {
    const { type, genre, startYear, endYear, minRating, maxRating } = req.query;

    const filter = {};

    if (type) {
      filter.type = type; // "movie" or "tv"
    }

    if (genre) {
      filter["genres.name"] = genre;
    }

    if (startYear || endYear) {
      filter.releaseDate = {};
      if (startYear) filter.releaseDate.$gte = new Date(`${startYear}-01-01`);
      if (endYear) filter.releaseDate.$lte = new Date(`${endYear}-12-31`);
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    const entities = await Entity.find(filter)
      .populate("directors cast seasons.episodes")
      .lean();

    res.json({ success: true, count: entities.length, entities });
  } catch (err) {
    next(err);
  }
};
