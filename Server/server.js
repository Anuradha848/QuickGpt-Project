import "dotenv/config";
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

// 🔥 CONNECT DB IMMEDIATELY
connectDB();

// routes
app.get("/", (req, res) => res.send("server is Live!"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// 🔥 LOCAL SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is Running on port " + PORT);
});

export default app;