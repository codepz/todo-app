import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class AuthController {
  /**
   * reister user
   */
  static async register(req, res, next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const { password, ...body } = req.body;
      await User.create({ ...body, password: hashPassword });
      res.status(201).json({ message: "User create successfully!" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * login user
   */
  static async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) return res.status(403).json({ message: "User not found!" });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword)
        return res.status(403).json({ message: "Invalid password!" });

      const accessToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20s",
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res
        .cookie("refreshToken", refreshToken, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(200)
        .json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  /**
   * logout
   */
  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(204).json();
      const user = await User.findOneAndUpdate(
        { refresh_token: refreshToken },
        {
          $set: { refresh_token: null },
        },
        { new: true }
      );
      if (!user) return res.status(204).json();
      res.clearCookie("refreshToken");
      res.status(200).json({ meesage: "User logout successfully!" });
    } catch (err) {
      next(err);
    }
  }
}
