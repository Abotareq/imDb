const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id ${err.value}`;
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;
