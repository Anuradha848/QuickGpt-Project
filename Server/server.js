import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connect (safe for Vercel)
let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await connect();
  next();
});

// routes
app.get("/", (req, res) => res.send("server is Live!"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

export default app;