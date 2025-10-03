import Joi from "joi";

const validateFormData = (schema) => {
  return (req, res, next) => {
    try {
      // Create a copy of the body data
      const data = { ...req.body };

      // Parse JSON string fields from form-data
      if (typeof data.genres === "string" && data.genres.trim()) {
        data.genres = JSON.parse(data.genres);
      }
      if (typeof data.directors === "string" && data.directors.trim()) {
        data.directors = JSON.parse(data.directors);
      }
      if (typeof data.cast === "string" && data.cast.trim()) {
        data.cast = JSON.parse(data.cast);
      }
      if (typeof data.seasons === "string" && data.seasons.trim()) {
        data.seasons = JSON.parse(data.seasons);
      }

      // Add file URLs from multer (if files were uploaded)
      if (req.files) {
        req.files.forEach((file) => {
          if (file.fieldname === "posterUrl") {
            data.posterUrl = file.path;
          }
          if (file.fieldname === "coverUrl") {
            data.coverUrl = file.path;
          }
          // Handle dynamic season and episode file uploads
          if (data.seasons) {
            data.seasons = data.seasons.map((season) => {
              const seasonNumber = season.seasonNumber;
              if (file.fieldname === `season${seasonNumber}_poster`) {
                season.posterUrl = file.path;
              }
              if (file.fieldname === `season${seasonNumber}_cover`) {
                season.coverUrl = file.path;
              }
              if (season.episodes) {
                season.episodes = season.episodes.map((episode) => {
                  const episodeNumber = episode.episodeNumber;
                  if (
                    file.fieldname ===
                    `season${seasonNumber}_episode${episodeNumber}_thumbnail`
                  ) {
                    episode.thumbnailUrl = file.path;
                  }
                  return episode;
                });
              }
              return season;
            });
          }
        });
      }

      // Convert date strings to Date objects if needed
      if (data.releaseDate && typeof data.releaseDate === "string") {
        data.releaseDate = new Date(data.releaseDate);
      }
      if (data.endDate && typeof data.endDate === "string") {
        data.endDate = new Date(data.endDate);
      }
      if (data.seasons) {
        data.seasons = data.seasons.map((season) => {
          if (season.episodes) {
            season.episodes = season.episodes.map((episode) => {
              if (
                episode.releaseDate &&
                typeof episode.releaseDate === "string"
              ) {
                episode.releaseDate = new Date(episode.releaseDate);
              }
              return episode;
            });
          }
          return season;
        });
      }

      console.log("🔍 Validating parsed data:", {
        title: data.title,
        type: data.type,
        hasGenres: !!data.genres,
        hasDirectors: !!data.directors,
        hasCast: !!data.cast,
        hasPosterUrl: !!data.posterUrl,
        hasCoverUrl: !!data.coverUrl,
        hasSeasons: !!data.seasons,
      });

      // Validate the parsed data
      const { error } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error) {
        console.log(
          "❌ Validation errors:",
          error.details.map((d) => d.message)
        );
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        });
      }

      // Update req.body with the parsed and mapped data
      req.body = data;

      console.log("✅ Validation passed");
      next();
    } catch (parseError) {
      console.log("❌ JSON Parse Error:", parseError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request fields",
        error: parseError.message,
      });
    }
  };
};

export default validateFormData;
