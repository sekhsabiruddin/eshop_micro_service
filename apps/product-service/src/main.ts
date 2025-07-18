import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ Add this
import "./jobs/product.crone.job";

import { errorMiddleware } from "@packages/error-middleware";
import router from "./routes/product.router";

const app = express();

app.use(cookieParser()); // ✅ Important: parse cookies

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6002;
const server = app.listen(port, () => {
  console.log(`🚀 Listening at http://localhost:${port}`);
});

server.on("error", console.error);
