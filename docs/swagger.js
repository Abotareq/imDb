import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMDb Clone API",
      version: "1.0.0",
      description: "API documentation for our IMDb-like app",
    },
    servers: [{ url: "http://localhost:5000/" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description:
            "JWT token passed in the `access_token` cookie. Example: `access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./routes/*.js", "./models/*.js", "./auth/*.js"], // paths to files with JSDoc comments
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
