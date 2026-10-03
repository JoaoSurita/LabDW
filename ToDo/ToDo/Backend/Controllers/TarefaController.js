import Tarefa, {SITUACOES} from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, participam} = req.body;
        const usuarioLogado = req.user.id;
        if(!titulo || !descricao || !dataLimite)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao: "PENDENTE", // toda tarefa nasce Pendente
                criadoPor: usuarioLogado,
                participam: Array.isArray(participam)? 
                participam : (participam ? [participam] : [])

            });
            const novaTarefa = await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(
                novaTarefa._id)
                .populate("criadoPor", "nome email")
                .populate("participam", "nome email");
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create
    static async getAll(req, res){
        const usuarioLogado = req.user.id;
        try {
            const tarefas = await Tarefa.find({
                    $or:[
                        {criadoPor:usuarioLogado},
                        {participam: usuarioLogado}
                    ]
                })
                .populate("criadoPor", "nome")
                .populate("participam", "nome")
                .sort({ createdAt: -1 });
            
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
        } catch (error) {
            return res.status(500).json({message:"Erro ao buscar todas tarefas", error});
        }

    }//fim getAll
    static async UpdateSituacao(req, res){
        const {id} = req.params;
        const {situacao} = req.body;
        const usuarioLogado = req.user.id;
        if(!Types.ObjectId.isValid(id)){
            return res.status(422).json({message:"Id da tarefa inválido"});
        }
        // Só é permitido mudar para Cancelada ou Finalizada
        if(!SITUACOES.includes(situacao) || situacao === "PENDENTE"){
            return res.status(422).json({message:"Situação inválida. Use CANCELADA ou FINALIZADA"});
        }
        try {
            const tarefa = await Tarefa.findById(id);
            if(!tarefa){
                return res.status(404).json({message:"Tarefa não encontrada"});
            }
            const ehCriador = tarefa.criadoPor.toString() === usuarioLogado;
            const ehParticipante = tarefa.participam.some(p => p.toString() === usuarioLogado);
            if(!ehCriador && !ehParticipante){
                return res.status(403).json({message:"Você não tem permissão para alterar esta tarefa"});
            }
            // Tarefa já cancelada ou finalizada não pode mudar novamente
            if(tarefa.situacao === "CANCELADA" || tarefa.situacao === "FINALIZADA"){
                return res.status(409).json({message:`A tarefa já está ${tarefa.situacao.toLowerCase()} e não pode ser alterada`});
            }
            tarefa.situacao = situacao;
            await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(tarefa._id)
                .populate("criadoPor", "nome")
                .populate("participam", "nome");
            return res.status(200).json({message:"Situação atualizada com sucesso", tarefa:tarefaPopulada});
        } catch (error) {
            return res.status(500).json({message:"Erro ao atualizar a situação da tarefa", error});
        }
    }//fim UpdateSituacao
}