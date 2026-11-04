import prisma from "../lib/prisma.js";
import type {Request, Response} from "express";

export default class EcopontoController{
    //transforma qualquer valor preenchido em texto; vazio vira null
    private static textoOuNulo(valor: unknown): string | null {
        return valor === undefined || valor === null || valor === "" ? null : String(valor);
    }

    //confere os dados e devolve { erro } ou { dados } pronto para o Prisma
    private static validar(corpo: Record<string, unknown>) {
        const nome = String(corpo.nome ?? "").trim();
        const latitudeTexto = EcopontoController.textoOuNulo(corpo.latitude);
        const longitudeTexto = EcopontoController.textoOuNulo(corpo.longitude);
        const notaTexto = EcopontoController.textoOuNulo(corpo.nota);

        if(nome === ""){
            return { erro: "O nome do ecoponto é obrigatório" };
        }
        if(latitudeTexto === null || longitudeTexto === null){
            return { erro: "Latitude e longitude são obrigatórias" };
        }

        const latitude = Number(latitudeTexto);
        const longitude = Number(longitudeTexto);
        if(!(latitude >= -90 && latitude <= 90)){
            return { erro: "Latitude inválida (deve estar entre -90 e 90)" };
        }
        if(!(longitude >= -180 && longitude <= 180)){
            return { erro: "Longitude inválida (deve estar entre -180 e 180)" };
        }

        const nota = notaTexto === null ? null : Number(notaTexto);
        if(nota !== null && (!Number.isInteger(nota) || nota < 0 || nota > 5)){
            return { erro: "A nota deve ser um número inteiro entre 0 e 5" };
        }

        return {
            dados: {
                nome,
                latitude: latitudeTexto,
                longitude: longitudeTexto,
                descricao: EcopontoController.textoOuNulo(corpo.descricao),
                cep: EcopontoController.textoOuNulo(corpo.cep),
                logradouro: EcopontoController.textoOuNulo(corpo.logradouro),
                numero: EcopontoController.textoOuNulo(corpo.numero),
                bairro: EcopontoController.textoOuNulo(corpo.bairro),
                cidade: EcopontoController.textoOuNulo(corpo.cidade),
                uf: EcopontoController.textoOuNulo(corpo.uf),
                nota,
            },
        };
    }

    static async Create(req:Request,res:Response){
        //verificação dos dados obrigatórios
        const resultado = EcopontoController.validar(req.body ?? {});
        if("erro" in resultado){
            return res.status(400).json({message: resultado.erro});
        }

        //inserir no banco de dados
        try
        {
            const novoEcoponto = await prisma.ecoponto.create({ data: resultado.dados });
            return res.status(201).json(novoEcoponto);
        }
        catch (error)
        {
            console.error(error);
            return res.status(500).json({message:"Erro ao cadastrar o ecoponto"});
        }
    }

    static async getEcopontos(req:Request,res:Response){
        try
        {
            const lista = await prisma.ecoponto.findMany({
                orderBy: { criadoEm: "desc" },
                include: { lixeiras: true },
            });
            return res.status(200).json(lista);
        }
        catch (error)
        {
            console.error(error);
            return res.status(500).json({message:"Erro ao buscar os ecopontos"});
        }
    }
}
