const bcrypt = require("bcryptjs");
const db = require("../../db/queries.js");

exports.handleSignup = async (req, res, next) => {
  try {
    const { first_name, last_name, username, password, confirm_password } =
      req.body;

    // check if passwords are the same
    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match.");
    }

    // check if user already exists
    const existingUser = await db.checkExistingUser(username);
    if (existingUser) {
      return res.status(400).send("Username already taken.");
    }

    // insert user into database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.addUser(first_name, last_name, username, hashedPassword);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
