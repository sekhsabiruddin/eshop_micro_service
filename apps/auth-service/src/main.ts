/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-middleware";
import router from "./routes/auth.router";

import swaggerUi from "swagger-ui-express";

const swaggerDocument = require("./swagger-output.json");
const app = express();

// Enable CORS for frontend origin 
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/doc-json", (req, res) => {
  res.json(swaggerDocument);
});
//routes
app.use("/api", router);
// Register global error handler middleware
app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`🚀 Listening at http://localhost:${port}`);
});

server.on("error", console.error);
