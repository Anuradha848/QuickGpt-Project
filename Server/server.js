import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

// ✅ VERY IMPORTANT ORDER
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("server is Live!");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);


export default app;