/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import cors from "cors";
import proxy from "express-http-proxy";
import rateLimit from "express-rate-limit";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import initializeConfig from "./libs/initiazeSiteConfig";
const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Logging, parsing, and middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Trust proxy (e.g., for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "",
});

app.use(limiter);

// Static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Health check
app.get("/health", (req, res) => {
  res.send({ message: "Welcome to API Gateway!" });
});

// Proxy to downstream service (e.g., auth-service on port 6001)
app.use("/", proxy("http://localhost:6001"));
app.use("/product", proxy("http://localhost:6002"));

// Start server
const port = process.env.PORT || 8080;

const server = app.listen(port, async () => {
  console.log(`🚀 Listening at http://localhost:${port}/api`);

  try {
    await initializeConfig(); // ✅ await the async function
    console.log("✅ Site config initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize site config:", error);
  }
});

server.on("error", console.error);
