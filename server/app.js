/**
 * import module
 */
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import * as conf from "./config/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import todoRoutes from "./routes/todo.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/**
 * database connect
 */
conf.connection();
const port = conf.config.port;

/**
 * Middlewares
 */
app.use(function (req, res, next) {
  res.io = io;
  next();
});
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Initialize Route Prefix
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

/**
 * handle error
 */
app.use((err, req, res, next) => {
  res.status(500).json({ name: err.name, message: err.message });
  // next();
});
/**
 * Listen Server
 */

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("emit_method", (msg) => console.log(msg));
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnect`);
  });
});
server.listen(port, () =>
  console.log(`[App] : ==> Server is running at > http://localhost:${port}`)
);
