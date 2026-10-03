import {Router} from "express";
import ChatController from "../Controllers/ChatController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesChat = new Router();


routesChat.get("/getHistory/:tarefaId", UserMiddleware, ChatController.getHistory);

export default routesChat;