const LocalStrategy = require("passport-local").Strategy;
const { GetUserByUsername, GetUserById, GetUserByToken } = require("../repositories/user");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    "token",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await GetUserByToken(password);

        if (!user) {
          throw "User does not exist";
        }

        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error });
      }
    })
  );

  passport.use(
    "local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await GetUserByUsername(username);

        if (!user) {
          throw "User does not exist";
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect Username or Password",
            });
          }
        });
      } catch (error) {
        return done(null, false, { message: error });
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await GetUserById(id);
    if (user) {
      done(null, user);
    }
  });
};
