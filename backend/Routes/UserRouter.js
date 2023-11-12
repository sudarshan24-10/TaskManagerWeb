import express from "express";
import User from "../Models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";
import { generateToken, isAuth } from "../utils.js";
const UserRouter = express.Router();

UserRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const existingEmail = req.body.email;
    const existingUser = await User.findOne({ email: existingEmail });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });

    const data = await newUser.save();
    res.status(200).send(data);
  })
);

UserRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      user.resetToken = token;
      user.save();
      console.log(`${process.env.BASE_URL}/reset-password/${token}`);
      const mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      });
      const data = {
        from: " MyAPP <gampasudarshananil@gmail.com>",
        to: `${user.name} <${user.email}>`,
        subject: "Reset Password",
        html: `<p>Please check the following link to reset your password</p>
        <a href="${process.env.BASE_URL}/reset-password/${token}}">reset password</a>`,
      };
      mg.messages().send(data, (error, body) => {
        if (error) {
          console.error(error);
        } else {
          console.log(body);
        }
      });
      res.send({ message: "we have sent reset link to your email address" });
    }
  })
);

UserRouter.post(
  "/reset-password",

  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid token" });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({ message: "Password reset Successful" });
          } else {
            res.status(404).send({ message: "user not found" });
          }
        }
      }
    });
  })
);

UserRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user),
      });
      return;
    }
    res.status(401).send({ message: "Invalid credentials" });
  })
);

UserRouter.get(
  "/api/users/checkAuth",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    res.json(true);
  })
);

export default UserRouter;
