const swaggerJsdoc = require("swagger-jsdoc");
const hostName = process.env.SITE_URL;

// Swagger options
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Vibe Chats API",
        version: "1.0.0",
        description: "This is the API documentation for Vibe Chats web-application.",
      },
      components: {
        securitySchemes: {
          BearerAdminAuth:{
              type:"http",
              scheme:"bearer",
              bearerFormat:"JWT"
          }
        },
      },
      servers: [
        {
          url:hostName
        },
      ],
    },
    apis: ["./routes/*.js"], // Path to the API routes to generate documentation from
  };

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;