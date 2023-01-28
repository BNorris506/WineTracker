const express = require("express");
const {requireUser} = require("./utils")
const usersRouter = express.Router();
const {
  getUserByUsername,
} = require("../db/models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;



usersRouter.post("/login", async (req, res, next) => {
        const { username, password } = req.body;
      
        if (!username || !password) {
          next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password",
          });
        }
      
        try {
          const user = await getUserByUsername(username);
          const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
          if (user && user.password == password) {
            res.send({ message: "you're logged in!", token, user });
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
