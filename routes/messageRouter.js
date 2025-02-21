const { Router } = require("express");
const messageController = require("../routes/controllers/messageController");
const messageRouter = Router();

messageRouter.post("/add", messageController.handleAddMessage);

module.exports = messageRouter;
