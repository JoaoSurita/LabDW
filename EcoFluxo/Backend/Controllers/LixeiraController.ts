import prisma from "../lib/prisma.js";
import { Tipo } from "@prisma/client";
import type {Request, Response} from "express";

const tiposAceitos: string[] = Object.values(Tipo);

export default class LixeiraController{
    //devolve o número se for inteiro maior que zero; caso contrário, null
    private static inteiroPositivo(valor: unknown): number | null {
        if(valor === undefined || valor === null || valor === ""){
            return null;
        }
        const numero = Number(valor);
        return Number.isInteger(numero) && numero > 0 ? numero : null;
    }

    //confere os dados e devolve { erro } ou { dados } pronto para o Prisma
    private static validar(corpo: Record<string, unknown>) {
        const uuid_sensor = String(corpo.uuid_sensor ?? "").trim();
        const tipo = String(corpo.tipo ?? "");
        const volume_max = LixeiraController.inteiroPositivo(corpo.volume_max);
        const nivel_cheio = LixeiraController.inteiroPositivo(corpo.nivel_cheio);
        const ecoponto_id = LixeiraController.inteiroPositivo(corpo.ecoponto_id);

        if(uuid_sensor === ""){
            return { erro: "O uuid do sensor é obrigatório" };
        }
        if(!tiposAceitos.includes(tipo)){
            return { erro: `Tipo inválido. Valores aceitos: ${tiposAceitos.join(", ")}` };
        }
        if(volume_max === null){
            return { erro: "volume_max deve ser um número inteiro maior que zero" };
        }
        if(nivel_cheio === null){
            return { erro: "nivel_cheio deve ser um número inteiro maior que zero" };
        }
        if(ecoponto_id === null){
            return { erro: "ecoponto_id é obrigatório e deve ser um número inteiro válido" };
        }

        return {
            dados: { uuid_sensor, tipo: tipo as Tipo, volume_max, nivel_cheio, ecoponto_id },
        };
    }

    static async Create(req:Request,res:Response){
        //verificação dos dados obrigatórios
        const resultado = LixeiraController.validar(req.body ?? {});
        if("erro" in resultado){
            return res.status(400).json({message: resultado.erro});
        }

        try
        {
            //o ecoponto informado precisa existir
            const existe = await prisma.ecoponto.count({ where: { id: resultado.dados.ecoponto_id } });
            if(existe === 0){
                return res.status(404).json({message:"Ecoponto não encontrado"});
            }

            //inserir no banco de dados
            const novaLixeira = await prisma.lixeira.create({ data: resultado.dados });
            return res.status(201).json(novaLixeira);
        }
        catch (error)
        {
            console.error(error);
            return res.status(500).json({message:"Erro ao cadastrar a lixeira"});
        }
    }

    static async getLixeiras(req:Request,res:Response){
        try
        {
            const lista = await prisma.lixeira.findMany({
                orderBy: { criadoEm: "desc" },
                include: { ecoponto: { select: { id: true, nome: true } } },
            });
            return res.status(200).json(lista);
        }
        catch (error)
        {
            console.error(error);
            return res.status(500).json({message:"Erro ao buscar as lixeiras"});
        }
    }
}
