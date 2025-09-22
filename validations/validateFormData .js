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
      if (req.files?.posterUrl) {
        data.posterUrl = req.files.posterUrl[0].path;
      }
      if (req.files?.coverUrl) {
        data.coverUrl = req.files.coverUrl[0].path;
      }
      
      // Convert date strings to Date objects if needed
      if (data.releaseDate && typeof data.releaseDate === 'string') {
        data.releaseDate = new Date(data.releaseDate);
      }
      if (data.endDate && typeof data.endDate === 'string') {
        data.endDate = new Date(data.endDate);
      }
      
      console.log("🔍 Validating parsed data:", {
        title: data.title,
        type: data.type,
        hasGenres: !!data.genres,
        hasDirectors: !!data.directors,
        hasCast: !!data.cast,
        hasPosterUrl: !!data.posterUrl,
        hasCoverUrl: !!data.coverUrl
      });
      
      // Validate the parsed data
      const { error } = schema.validate(data, { 
        abortEarly: false,
        allowUnknown: false 
      });
      
      if (error) {
        console.log("❌ Validation errors:", error.details.map(d => d.message));
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }
      
      console.log("✅ Validation passed");
      next();
      
    } catch (parseError) {
      console.log("❌ JSON Parse Error:", parseError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request fields",
        error: parseError.message
      });
    }
  };
};

export default validateFormData;

// You should also update your validation schema to make all fields optional for PATCH:
// validations/entity.validation.js - Update your updateEntity schema:

/*
updateEntity: Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  releaseDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  posterUrl: Joi.string().uri().allow("").optional(),
  coverUrl: Joi.string().uri().allow("").optional(),
  directors: Joi.array().items(Joi.string().hex().length(24)).optional(),
  cast: Joi.array().items(Joi.string().hex().length(24)).optional(),
  genres: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow("").optional(),
    })
  ).optional(),
  type: Joi.string().valid("movie", "tv").optional(),
  seasons: Joi.array().items(
    Joi.object({
      seasonNumber: Joi.number().required(),
      description: Joi.string().allow("").optional(),
      posterUrl: Joi.string().uri().allow("").optional(),
      coverUrl: Joi.string().uri().allow("").optional(),
      episodes: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          episodeNumber: Joi.number().required(),
          description: Joi.string().allow("").optional(),
          releaseDate: Joi.date().optional(),
          duration: Joi.number().optional(),
          thumbnailUrl: Joi.string().uri().allow("").optional(),
        })
      ).optional(),
    })
  ).optional(),
}),
*/