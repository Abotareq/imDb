import Joi from "joi";

const entityBase = {
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  releaseDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  posterUrl: Joi.string().uri().allow("").optional(),
  coverUrl: Joi.string().uri().allow("").optional(),
  directors: Joi.array().items(Joi.string().hex().length(24)).default([]),
  cast: Joi.array().items(Joi.string().hex().length(24)).default([]),
  genres: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow("").optional(),
      })
    )
    .default([]),
};

const seasonSchema = Joi.object({
  seasonNumber: Joi.number().required(),
  description: Joi.string().allow("").optional(),
  posterUrl: Joi.string().uri().allow("").optional(),
  coverUrl: Joi.string().uri().allow("").optional(),
  rating: Joi.number().min(0).max(10).default(0),
  episodes: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        episodeNumber: Joi.number().required(),
        description: Joi.string().allow("").optional(),
        releaseDate: Joi.date().optional(),
        duration: Joi.number().optional(),
        thumbnailUrl: Joi.string().uri().allow("").optional(),
      })
    )
    .default([]),
});

export const entityValidation = {
  createMovie: Joi.object({
    ...entityBase,
    type: Joi.string().valid("movie").required(),
  }),
  createTv: Joi.object({
    ...entityBase,
    type: Joi.string().valid("tv").required(),
    seasons: Joi.array().items(seasonSchema).default([]),
  }),
  updateEntity: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().allow("").optional(),
    releaseDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    posterUrl: Joi.string().uri().allow("").optional(),
    coverUrl: Joi.string().uri().allow("").optional(),
    directors: Joi.array().items(Joi.string().hex().length(24)).optional(),
    cast: Joi.array().items(Joi.string().hex().length(24)).optional(),
    genres: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().allow("").optional(),
        })
      )
      .optional(),
    type: Joi.string().valid("movie", "tv").optional(),
    seasons: Joi.array().items(seasonSchema).optional(),
  }),
};
