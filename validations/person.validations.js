import Joi from "joi";

export const personValidation = {
  createPerson: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    bio: Joi.string().allow("").optional().max(2000),
    dateOfBirth: Joi.date().optional().less('now'),
    photoUrl: Joi.string().uri().allow("").optional(),
    roles: Joi.array()
      .items(Joi.string().valid("actor", "director", "writer"))
      .min(1)
      .required()
      .unique()
  }),

  updatePerson: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    bio: Joi.string().allow("").optional().max(2000),
    dateOfBirth: Joi.date().optional().less('now'),
    photoUrl: Joi.string().uri().allow("").optional(),
    roles: Joi.array()
      .items(Joi.string().valid("actor", "director", "writer"))
      .min(1)
      .optional()
      .unique()
  }),

  getPersonsByRole: Joi.object({
    role: Joi.string().valid("actor", "director", "writer").required()
  }),

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
    role: Joi.string().valid("actor", "director", "writer").optional()
  })
};

// Middleware for form-data validation (similar to validateFormData for entities)
export const validatePersonFormData = (schema) => {
  return (req, res, next) => {
    try {
      // Create a copy of the body data
      const data = { ...req.body };
      
      // Parse roles if it's a JSON string from form-data
      if (typeof data.roles === "string" && data.roles.trim()) {
        data.roles = JSON.parse(data.roles);
      }
      
      // Add photoUrl from uploaded file (if file was uploaded)
      if (req.file) {
        data.photoUrl = req.file.path;
      }
      
      // Convert date string to Date object if needed
      if (data.dateOfBirth && typeof data.dateOfBirth === 'string') {
        data.dateOfBirth = new Date(data.dateOfBirth);
      }
      
      console.log("🔍 Validating person data:", {
        name: data.name,
        hasRoles: !!data.roles,
        rolesCount: data.roles?.length,
        hasPhoto: !!data.photoUrl,
        hasDateOfBirth: !!data.dateOfBirth
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
      
      console.log("✅ Person validation passed");
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

// Regular validation middleware for JSON requests
export const validatePerson = (schema) => {
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