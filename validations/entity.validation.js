import Joi from "joi";
// validations/entity.validation.js
const entityBase = {
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  releaseDate: Joi.date().optional(),
  endDate: Joi.date().optional(),

  // Make file URLs optional since they might not always be uploaded
  posterUrl: Joi.string().uri().allow("").optional(),
  coverUrl: Joi.string().uri().allow("").optional(),

  // Allow empty arrays for these
  directors: Joi.array().items(Joi.string().hex().length(24)).default([]),
  cast: Joi.array().items(Joi.string().hex().length(24)).default([]),

  genres: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow("").optional(),
    })
  ).default([]),
};

export const entityValidation = {
  createMovie: Joi.object({
    ...entityBase,
    type: Joi.string().valid("movie").required(),
  }),

  createTv: Joi.object({
    ...entityBase,
    type: Joi.string().valid("tv").required(),
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
        ).default([]),
      })
    ).default([]),
  }),

  updateEntity: Joi.object({
    ...entityBase,
    type: Joi.string().valid("movie", "tv").optional(),
  }),
};