import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";

const routesTarefa = new Router();

routesTarefa.post("/create", TarefaController.Create);
routesTarefa.get("/getAll", TarefaController.getAll);

export default routesTarefa;