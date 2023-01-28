const express = require("express");
const apiRouter = express.Router();
const { getUserById } = require("../db/models/users");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET = "do not tell" } = process.env;


// Authorization
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      console.log("this is line 39:", id);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});


apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const reviewsRouter = require("./reviews");
apiRouter.use("/reviews", reviewsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

const wineRouter = require("./wine");
apiRouter.use("/wine", wineRouter);


module.exports = apiRouter;
