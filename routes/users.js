const express = require("express");
const router = express.Router();
const passport = require("passport");

const { CreateUser, updateUserTokenById, GetUserById, checkTokenExists } = require("../repositories/user");
const { ensureAuthenticated, createHashToken } = require("../repositories/base");

router.get("/whoami", ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await GetUserById(req.user.id);
    if (!user) {
      return res.status(401).send();
    }
    return res.json({ ...user }).end();
  } catch (error) {
    return next(error);
  }
});

router.post("/token/login", async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.send();
  } else {
    passport.authenticate("token", (err, user) => {
      try {
        if (err) {
          throw new Error(err);
        }
        if (!user) {
          throw new Error("Token is invalid.");
        }
        req.logIn(user, async (error) => {
          if (error) {
            throw new Error(error);
          }
          return res.send();
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    try {
      if (err) {
        throw new Error(err);
      }
      if (!user) {
        throw new Error("Username or password is incorrect");
      }
      req.logIn(user, async (error) => {
        if (error) {
          throw new Error(error);
        }
        const result = await checkTokenExists(req.user.id);
        let token = result.token;

        if (!token) {
          const result = await createHashToken();
          token = result.token;
          await updateUserTokenById(user.id, result.hash);
        }

        return res.json({ token }).send();
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/logout", async (req, res, next) => {
  try {
    req.logout();
    return res.send();
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await CreateUser(req.body);
    req.logIn(user[0], async (error) => {
      if (error) {
        throw new Error(error);
      }
      const token = user[0].token;
      return res.json({ token }).send();
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
