import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesTarefa = new Router();

routesTarefa.post("/create", UserMiddleware, TarefaController.Create);
routesTarefa.get("/getAll", UserMiddleware, TarefaController.getAll);
routesTarefa.patch("/updateSituacao/:id", UserMiddleware, TarefaController.UpdateSituacao);

export default routesTarefa;