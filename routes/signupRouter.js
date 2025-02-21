const { Router } = require("express");
const signupController = require("../routes/controllers/signupController");
const signupRouter = Router();

signupRouter.get("/", (req, res) => {
  res.render("sign-up");
});
signupRouter.post("/", signupController.handleSignup);

module.exports = signupRouter;
