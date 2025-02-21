const db = require("../../db/queries.js");
require("dotenv").config();

exports.handleMemberStatus = async (req, res) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to access this page.");
  }
  const { password } = req.body;
  const userId = req.user.id;

  try {
    let updatedUser = null;
    if (password === process.env.ADMIN_SECRET) {
      updatedUser = db.setAdminStatusTrue(userId);
    } else if (password === process.env.MEMBER_SECRET) {
      updatedUSer = db.setMemberStatusTrue(userId);
    } else {
      req.flash("error", "Incorrect password. Please try again.");
      return res.redirect("/member-status");
    }
    req.user = updatedUser;
    res.redirect("/member-status");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error.");
  }
};
