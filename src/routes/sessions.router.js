import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  res.send({ status: "success", message: "registered" });
});

router.get("/current", passportCall("current"), (req, res) => {
  if (!req.user) {
    return res.status(400).send({ status: "error", message: "not logged in" });
  }

  console.log(req.user), res.send(req.user);
});

router.get("/logout", (req, res) => {
  for (const cookie in req.cookies) {
    res.clearCookie(cookie);
  }

  res.send({ status: "success", message: "cookies cleared" });
});

router.post("/login", passportCall("login"), async (req, res) => {
  const sessionUser = {
    name: `${req.user.firstName} ${req.user.lastName}`,
    role: req.user.role,
    id: req.user._id,
  };

  const token = jwt.sign(sessionUser, "0$Ip87iYNIc4dP9dLEwd7Giu8ko", {
    expiresIn: 60 * 60, // 1 hora
  });

  res.cookie("sid", token).send({ status: "success", message: "logged" });
});

export default router;
