import express from "express";
import TodosController from "../app/Http/TodosController.js";
const router = express.Router();

router.get("/", TodosController.index);
router.get("/:id", TodosController.show);
router.post("/", TodosController.create);
router.patch("/:id", TodosController.update);
router.delete("/:id", TodosController.delete);

export default router;
