import "dotenv/config"; //tem que ser a primeira linha no index.js
import express from "express";
// websocket
import { Server } from "socket.io";
// Juntar o Express e WebSocket
import { createServer } from "http";
import registerChatSocket from "./Socket/registerChatSocket.js";
import cors from "cors";
import routesTarefa from "./Routes/routesTarefa.js";
import routesUsuario from "./Routes/routesUsuario.js";
import routesChat from "./Routes/routesChat.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import cookieParser from "cookie-parser";
import { disconnect } from "cluster";
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
//suporte para importar arquivos json usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
const app = new express();
//comunicação entre front e back usar json
app.use(express.json());

app.use(cors({
    credentials: true, 
    origin: FRONTEND_URL
}));
app.use(cookieParser());
// Criar um servidor Http
const httpServer = createServer(app);
// Iniciar o WebSocket
const io = new Server(httpServer,{
    cors:{
        origin: FRONTEND_URL,
        credentials: true,
    }
});
io.on("connect", (socket)=>{
    console.log(`Usuário Conectado: ${socket.id}`);
    registerChatSocket(io, socket);
    socket.on("disconnect", ()=>{
        console.log(`Usuário Desconectado: ${socket.id}`);
    })
})
//obrigatoriamente o swagger deve vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/ToDo", routesTarefa);
app.use("/ToDo", routesUsuario);
app.use("/ToDo", routesChat);
httpServer.listen(PORT, ()=>{
    `Servidor rodando na porta ${PORT}`
});