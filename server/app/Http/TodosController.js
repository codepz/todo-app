import Todo from "../models/Todo.js";

export default class TodosController {
  static async index(req, res, next) {
    try {
      const todos = await Todo.find();
      res.status(200).json(todos);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    // console.log("create", res.io);
    try {
      const newTodo = await Todo.create(req.body);
      res.status(200).json(newTodo);
      res.io.emit("todo:create", newTodo);
    } catch (err) {
      next(err);
    }
  }

  static async show(req, res, next) {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) return res.status(405).json({ message: "Not Found!" });
      res.status(200).json(todo);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const todo = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            dueTime: req.body.dueTime,
            completed: req.body.completed,
          },
        },
        {
          new: true,
        }
      );
      if (!todo) return res.status(405).json({ message: "User Not Found!" });
      res.status(201).json({ message: "Updated!", todo });
      res.io.emit("todo:update", { message: "Updated!", todo });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(405).json({ message: "Not Found!" });
      res.status(200).json({ message: "Delete Success!" });
      res.io.emit("todo:delete", todo);
    } catch (err) {
      next(err);
    }
  }
}
