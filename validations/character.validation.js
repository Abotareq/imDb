// validations/character.validation.js
import Joi from "joi";

export const characterValidation = {
  createCharacter: Joi.object({
    name: Joi.string().required().trim().min(1).max(100),
    description: Joi.string().allow("").optional().max(1000),
    actor: Joi.string().hex().length(24).required(),
    entity: Joi.string().hex().length(24).required(),
  }),

  updateCharacter: Joi.object({
    name: Joi.string().trim().min(1).max(100).optional(),
    description: Joi.string().allow("").optional().max(1000),
    actor: Joi.string().hex().length(24).optional(),
    entity: Joi.string().hex().length(24).optional(),
  }).min(1), // At least one field must be provided

  createMultipleCharacters: Joi.object({
    characters: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().trim().min(1).max(100),
          description: Joi.string().allow("").optional().max(1000),
          actor: Joi.string().hex().length(24).required(),
          entity: Joi.string().hex().length(24).required(),
        })
      )
      .min(1)
      .max(50)
      .required(), // Allow max 50 characters at once
  }),

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
    entity: Joi.string().hex().length(24).optional(),
    actor: Joi.string().hex().length(24).optional(),
  }),

  pathParams: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),

  entityParams: Joi.object({
    entityId: Joi.string().hex().length(24).required(),
  }),

  actorParams: Joi.object({
    actorId: Joi.string().hex().length(24).required(),
  }),
};

// Regular validation middleware for JSON requests
export const validateCharacter = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    next();
  };
};

// Validate query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true, // Allow additional query params
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    next();
  };
};

// Validate URL parameters
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    next();
  };
};

// Validation middleware specifically for ObjectId parameters
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format. Must be a valid MongoDB ObjectId`,
        error: `${paramName}: ${id}`,
      });
    }

    next();
  };
};

// Combined validation for character creation/update with relationship checks
export const validateCharacterWithRelations = (schema) => {
  return async (req, res, next) => {
    // First validate the basic schema
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    // Additional validation can be done here if needed
    // (e.g., check if actor/entity exist, but we handle this in controllers)

    next();
  };
};
