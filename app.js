const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db/pool");
const bcrypt = require("bcryptjs");

const signupRouter = require("./routes/signupRouter");
const loginRouter = require("./routes/loginRouter");
const memberStatusRouter = require("./routes/memberStatusRouter");

// setup to use ejs
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// setup session
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sign-up", signupRouter);
app.use("/log-in", loginRouter(passport));
app.use("/member-status", memberStatusRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
