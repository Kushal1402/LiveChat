const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
const { initSocket } = require('./utils/socket');

require("dotenv").config();
require('./config/db')

// Swagger 
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const swaggerAuth = require("./middleware/swagger-auth")
// const swaggerCssOptions = {
//     customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css'
// };
const swaggerCssOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css', // Corrected CSS URL
    customJs: [
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.18.3/swagger-ui-bundle.js', // Corrected JS bundle URL
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.18.3/swagger-ui-standalone-preset.js' // Corrected JS standalone URL
    ],
    customfavIcon: 'https://raw.githubusercontent.com/Kushal1402/LiveChat/develop/front-node-api/static_assets/vibe_chats.png'
};
// Serve Swagger UI
app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerCssOptions));

// Connect Database
mongoose.Promise = global.Promise;

// Node Port
const port = process.env.PORT || 5000;

// Guest Routes
const GuestRoutes = require('./routes/guest/guest');

// User Routes
const UserRoutes = require('./routes/user/user');

// Conversation Routes
const ConversationRoutes = require('./routes/user/conversation');

// Message Routes
const MessageRoutes = require('./routes/user/message');

app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/api/guest", GuestRoutes);

app.use("/api/user", UserRoutes);

app.use("/api/conversation", ConversationRoutes);

app.use("/api/message", MessageRoutes);

// Base Route
app.get("/", (req, res) => {
    console.log("success");
    res.send(`Api running .... connected db : ${process.env.MONGO_HOST}`)
});
app.get("/cancel", (req, res) => {
    console.log("cancel");
    res.send(`Api running .... cancelled`)
});
app.get("/success", (req, res) => {
    console.log("success");
    res.send(`Api running .... success`)
});

app.use(async (error, req, res, next) => {
    res.status(error.status || 500);
    if (error.status) {
        return res.json({
            message: error.message,
        });
    }
    return res.json({
        message: "Internal Server Error",
        error: error.message,
    });
});

const server = app.listen(port, () => {
    console.log('Server started at : ' + port)
});

initSocket(server);