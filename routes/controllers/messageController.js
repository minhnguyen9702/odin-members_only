const db = require("../../db/queries.js");

exports.handleAddMessage = async (req, res) => {
  const { title, text } = req.body;
  const userId = req.user.id;

  try {
    await db.createMessage(userId, title, text);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error posting message. Try again.");
    res.redirect("/");
  }
};
