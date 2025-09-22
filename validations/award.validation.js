import Joi from "joi";

const currentYear = new Date().getFullYear();

export const awardValidation = {
  createAward: Joi.object({
    name: Joi.string().required().trim().min(2).max(200),
    category: Joi.string().required().trim().min(2).max(100),
    year: Joi.number().integer().min(1900).max(currentYear + 1).optional(),
    entity: Joi.string().hex().length(24).optional().allow(null, ""),
    person: Joi.string().hex().length(24).optional().allow(null, "")
  }).custom((value, helpers) => {
    // At least one of entity or person must be provided
    if (!value.entity && !value.person) {
      return helpers.error('custom.entityOrPerson');
    }
    return value;
  }).messages({
    'custom.entityOrPerson': 'Either entity or person must be provided'
  }),

  updateAward: Joi.object({
    name: Joi.string().trim().min(2).max(200).optional(),
    category: Joi.string().trim().min(2).max(100).optional(),
    year: Joi.number().integer().min(1900).max(currentYear + 1).optional(),
    entity: Joi.string().hex().length(24).optional().allow(null, ""),
    person: Joi.string().hex().length(24).optional().allow(null, "")
  }).min(1), // At least one field must be provided

  createMultipleAwards: Joi.object({
    awards: Joi.array().items(
      Joi.object({
        name: Joi.string().required().trim().min(2).max(200),
        category: Joi.string().required().trim().min(2).max(100),
        year: Joi.number().integer().min(1900).max(currentYear + 1).optional(),
        entity: Joi.string().hex().length(24).optional().allow(null, ""),
        person: Joi.string().hex().length(24).optional().allow(null, "")
      }).custom((value, helpers) => {
        if (!value.entity && !value.person) {
          return helpers.error('custom.entityOrPerson');
        }
        return value;
      }).messages({
        'custom.entityOrPerson': 'Either entity or person must be provided'
      })
    ).min(1).max(100).required()
  }),

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
    year: Joi.number().integer().min(1900).max(currentYear + 1).optional(),
    category: Joi.string().trim().min(1).max(100).optional(),
    entity: Joi.string().hex().length(24).optional(),
    person: Joi.string().hex().length(24).optional()
  }),

  pathParams: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),

  entityParams: Joi.object({
    entityId: Joi.string().hex().length(24).required(),
  }),

  personParams: Joi.object({
    personId: Joi.string().hex().length(24).required(),
  }),

  yearParams: Joi.object({
    year: Joi.number().integer().min(1900).max(currentYear + 1).required()
  })
};

export const validateAward = (schema) => {
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

// Custom validation for year parameter
export const validateYear = (req, res, next) => {
  const year = parseInt(req.params.year);
  
  if (!year || isNaN(year) || year < 1900 || year > currentYear + 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid year parameter",
      error: `Year must be between 1900 and ${currentYear + 1}`
    });
  }
  
  next();
};