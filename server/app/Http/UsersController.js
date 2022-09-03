import User from "../models/User.js";

export default class UsersController {
  static async index(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}
