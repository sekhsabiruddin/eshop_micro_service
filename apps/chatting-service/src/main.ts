import express from "express";
import cookieParser from "cookie-parser";
import { createWebSocketServer } from "./websocket";
import { startConsumer } from "./chat-message.consummer";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT || 6006;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
// WebSocket server
createWebSocketServer(server);

// Start Kafka consumer
startConsumer().catch((error: any) => {
  console.log(error);
});

server.on("error", console.error);
