const { Router } = require("express");
const messageController = require("../routes/controllers/messageController");
const messageRouter = Router();

messageRouter.post("/add", messageController.handleAddMessage);
messageRouter.post("/delete/:id", messageController.handleDeleteMessage);

module.exports = messageRouter;
