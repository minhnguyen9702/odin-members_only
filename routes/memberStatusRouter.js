const { Router } = require("express");
const memberStatusController = require("../routes/controllers/memberStatusController");
const memberStatusRouter = Router();

memberStatusRouter.get("/", (req, res) => {
  res.render("member-status");
});

memberStatusRouter.post("/", memberStatusController.handleMemberStatus);

module.exports = memberStatusRouter;
