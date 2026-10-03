import ChatController from "../Controllers/ChatController.js";
export default function registerChatSocket(io, socket){
    //entrar em um chat específico (de uma tarefa)
    socket.on("join_task", (tarefaId)=>{
        socket.join(`tarefa_${tarefaId}`);
        console.log(`socket ${socket.id} entrou no chat da tarefa_${tarefaId}`);
    });
    //enviar a mensagem
    socket.on("send_message", (data)=>{
        ChatController.sendSaveMessage(io, socket, data);
    });

    //sair do chat
    socket.on("leave_task", (tarefaId)=>{
        socket.leave(`tarefa_${tarefaId}`);
    });
}