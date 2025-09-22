import Joi from "joi";
import Review from "../models/review.model.js";

export const reviewValidation = {
  createReview: Joi.object({
    entity: Joi.string().hex().length(24).required(),
    rating: Joi.number().integer().min(1).max(10).required(),
    comment: Joi.string().max(1000).optional().allow('')
  }),

  updateReview: Joi.object({
    rating: Joi.number().integer().min(1).max(10).optional(),
    comment: Joi.string().max(1000).optional().allow('')
  }).min(1), // At least one field must be provided

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    entity: Joi.string().hex().length(24).optional(),
    user: Joi.string().hex().length(24).optional(),
    minRating: Joi.number().integer().min(1).max(10).optional(),
    maxRating: Joi.number().integer().min(1).max(10).optional(),
    search: Joi.string().trim().min(1).max(100).optional()
  }).custom((value, helpers) => {
    // Ensure minRating <= maxRating if both are provided
    if (value.minRating && value.maxRating && value.minRating > value.maxRating) {
      return helpers.error('custom.ratingRange');
    }
    return value;
  }).messages({
    'custom.ratingRange': 'minRating must be less than or equal to maxRating'
  }),

  pathParams: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),

  entityParams: Joi.object({
    entityId: Joi.string().hex().length(24).required(),
  }),

  userParams: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  })
};

// Regular validation middleware for JSON requests
export const validateReview = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      allowUnknown: false 
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
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
      allowUnknown: true 
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
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
      allowUnknown: false 
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Middleware to check if user already reviewed the entity
export const checkExistingReview = async (req, res, next) => {
  try {
    const { entity } = req.body;
    const userId = req.user.id;

    if (!entity) {
      return next(); // Let the main validation handle missing entity
    }

    const existingReview = await Review.findOne({ user: userId, entity });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this entity",
        error: "Duplicate review not allowed",
        existingReview: {
          id: existingReview._id,
          rating: existingReview.rating,
          createdAt: existingReview.createdAt
        }
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while checking existing review"
    });
  }
};

// Middleware to check review ownership
export const checkReviewOwnership = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Allow access if user is the author or an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only access your own reviews"
      });
    }

    // Attach review to request for use in controller
    req.review = review;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while checking review ownership"
    });
  }
};

// Middleware to validate rating range in query
export const validateRatingRange = (req, res, next) => {
  const { minRating, maxRating } = req.query;
  
  if (minRating && (minRating < 1 || minRating > 10)) {
    return res.status(400).json({
      success: false,
      message: "minRating must be between 1 and 10"
    });
  }
  
  if (maxRating && (maxRating < 1 || maxRating > 10)) {
    return res.status(400).json({
      success: false,
      message: "maxRating must be between 1 and 10"
    });
  }
  
  if (minRating && maxRating && Number(minRating) > Number(maxRating)) {
    return res.status(400).json({
      success: false,
      message: "minRating must be less than or equal to maxRating"
    });
  }
  
  next();
};