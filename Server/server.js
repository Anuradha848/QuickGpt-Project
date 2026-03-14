// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import chatRouter from "./routes/chatRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";
// import creditRouter from "./routes/creditRoutes.js";
// import { stripeWebhooks } from "./controllers/webhooks.js";

// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // connect DB when a request happens
// connectDB();

// // routes
// app.get("/", (req, res) => res.send("server is Live!"));
// app.use("/api/user", userRouter);
// app.use("/api/chat", chatRouter);
// app.use("/api/message", messageRouter);
// app.use("/api/credit", creditRouter);

// app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// export default app;

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is Live!");
});

export default app;