import express from "express";
import UsersController from "../app/Http/UsersController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, UsersController.index);

export default router;
