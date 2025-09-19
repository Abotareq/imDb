import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
      errors: { wrap: { label: "" } },
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return next(
        new ErrorResponse("Validation failed", StatusCodes.BAD_REQUEST, errors)
      );
    }

    req[source] = value;
    next();
  };
};

export default validateRequest;
