const swaggerAutoGen = require("swagger-autogen")();
const hostName = process.env.SITE_URL;

// Swagger options
const doc = {
    info: {
        title: "Vibe Chat API",
        description: "Vibe Chat API documentation",
    },
    host: hostName,
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json", "multipart/form-data"],
    produces: ["application/json"],
    autoBody: true,
    tags: [
        {
            name: "Users",
            description: "User routes",
        },
    ],
    securityDefinitions: {
        authToken: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Enter valid authorization token. Like: Bearer Token",
        },
    },
};

// Initialize Swagger
const outputFile = "./swagger-output.json";
const routes = ["./server.js"]; // Path to your route files

// Generate Swagger documentation
swaggerAutoGen(outputFile, routes, doc).then(() => {
    console.log("Swagger documentation generated successfully.");
}).catch((err) => {
    console.error("Error generating Swagger documentation:", err);
});