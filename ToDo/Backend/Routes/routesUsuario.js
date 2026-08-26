// Importando Bibliotecas
import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";

const routesUsuario = new Router();

// Criando rotas referente aos métodos no TarefaController
routesUsuario.post("/createUsuario", UsuarioController.Create);

// Exportando rotas
export default routesUsuario;