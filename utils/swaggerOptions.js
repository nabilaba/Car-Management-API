const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Challange 6 API",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express and documented with Swagger",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Nabil Aba",
      url: "https://nabilaba.github.io",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./swagger/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

exports.swaggerSpec = swaggerSpec;
