// Importando as bibliotecas
import express from "express";
import cors from "cors"
import { createRequire } from "module"
// Incluir as rotas
import routes from "./Routes/routes.js"
// Importando Swagger
import swaggerUi from "swagger-ui-express";
// Suporte para importar arquivos .json usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
// -----

const app = new express();
// Comunicação entre front e back utilizar .json
app.use(express.json());
app.use(cors({
    credential: true,
    origin: "http://localhost:5173"
}));
// Obrigatoriamente o swagger deve vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ligar o express com as rota
app.use("/ToDo", routes);
app.listen(5000);