const express = require("express");
const {requireUser} = require("./utils")
const usersRouter = express.Router();
const {
  getUser,
} = require("../db/users");

// const jwt = require("jsonwebtoken");
// const { JWT_SECRET = "do not tell" } = process.env;



usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      return res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//  GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
