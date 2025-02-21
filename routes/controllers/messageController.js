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

exports.handleDeleteMessage = async (req, res) => {
  if (!req.user || !req.user.admin_status) {
    return res.status(403).send("Unauthorized");
  }

  try {
    await db.deleteMessage(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting message.");
  }
};
