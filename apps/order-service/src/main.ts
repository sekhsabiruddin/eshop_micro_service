import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@packages/error-middleware";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use("/api", router);
app.use(errorMiddleware);
// app.post(
//   "/api/create-order",
//   bodyParser.raw({ type: "application/json" }),
//   (req, res, next) => {
//     (req as any).rawBody = req.body;
//     next();
//   },
//   createOrder
// );

app.get("/", (req, res) => {
  res.send({ message: "Welcome to order-service!" });
});

const port = process.env.PORT || 6004;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on("error", console.error);
