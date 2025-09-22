import Joi from "joi";

export const articleValidation = {
  createArticle: Joi.object({
    title: Joi.string().required().trim().min(5).max(200),
    content: Joi.string().required().min(50).max(50000),
    relatedEntity: Joi.string().hex().length(24).optional().allow(null, "")
  }),

  updateArticle: Joi.object({
    title: Joi.string().trim().min(5).max(200).optional(),
    content: Joi.string().min(50).max(50000).optional(),
    relatedEntity: Joi.string().hex().length(24).optional().allow(null, "")
  }).min(1), // At least one field must be provided

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
    author: Joi.string().hex().length(24).optional(),
    entity: Joi.string().hex().length(24).optional()
  }),

  pathParams: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),

  authorParams: Joi.object({
    authorId: Joi.string().hex().length(24).required(),
  }),

  entityParams: Joi.object({
    entityId: Joi.string().hex().length(24).required(),
  })
};

// Regular validation middleware for JSON requests
export const validateArticle = (schema) => {
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
      allowUnknown: true // Allow additional query params
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

// Middleware to check if user is verified (for article creation)
export const requireVerified = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      message: "Only verified users can perform this action",
      error: "Account verification required"
    });
  }
  next();
};

// Middleware to check article ownership
export const checkArticleOwnership = async (req, res, next) => {
  try {
    const { Article } = await import("../models/article.model.js");
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Allow access if user is the author or an admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only access your own articles"
      });
    }

    // Attach article to request for use in controller
    req.article = article;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while checking article ownership"
    });
  }
};