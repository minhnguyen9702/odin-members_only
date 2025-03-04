const path = require("node:path");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db/pool");
const bcrypt = require("bcryptjs");

const db = require("./db/queries.js");
const signupRouter = require("./routes/signupRouter");
const loginRouter = require("./routes/loginRouter");
const memberStatusRouter = require("./routes/memberStatusRouter");
const messageRouter = require("./routes/messageRouter");

// setup to use ejs
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// setup session
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

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
  res.locals.user = req.user || null;
  res.locals.errorMessage = req.flash("error");
  next();
});
app.get("/", async (req, res) => {
  try {
    const messages = await db.getAllMessages();
    res.render("index", {messages} );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching messages.");
  }
});
app.use("/sign-up", signupRouter);
app.use("/log-in", loginRouter(passport));
app.use("/member-status", memberStatusRouter);
app.use("/message", messageRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
