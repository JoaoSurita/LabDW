import prisma from "../lib/prisma.js";
import {hash, verify} from "@node-rs/argon2"
import type { Request, Response } from "express";
import { send2FACodeEMail } from "../Services/emailServices.js";
export default class UsuarioController {
    static async Create(req: Request, res: Response) {
        try {
            const { } = req.body;
            //verificação dos dados obrigatórios

            //inserir no banco de dados
        } catch (error) {

        }

    };
    static async Login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            //verificação dos dados obrigatórios
            if (!email || !senha) {
                return res.status(404).json({ message: "E-mail e senha são obrigatórios" });
            }
            try {
                const usuario = await prisma.usuario.findUnique({
                    where: { email }
                });
                if (!usuario) {
                    return res.status(500).json({ message: "Verifique as credenciais" });
                }
                const senhaCorreta = await verify(usuario.senha, senha)
                if (!senhaCorreta) {
                    return res.status(500).json({ message: "Verifique as credenciais" });
                }
                // gerar o código 2FA
                const codigoFA = Math.floor(100000 + Math.random() * 900000).toString();
                const expiracao = new Date(Date.now() + 10 * 60 * 1000);
                // atualizar o código e tempo no banco de dados
                await prisma.usuario.update({
                    where:{id:usuario.id},
                    data:{
                        loginCode: codigoFA,
                        loginCodeExpires: expiracao
                    }
                });
                await send2FACodeEMail(usuario.email, codigoFA);
                return res.status(200).json({
                    require2FA: true,
                    message: "Código de verificação enviado para seu e-mail",
                    email: usuario.email
                })
            }
            catch (error) {
            return res.status(500).json({ message: "Problema interno - login" });
            }
        } catch(error){

        }

    };
    static async Logout(req: Request, res: Response) {
        try {

        } catch (error) {

        }

    };
    static async Verify2FA(req: Request, res: Response) {
        try {
            const { } = req.body;
            //verificação dos dados obrigatórios

            //inserir no banco de dados
        } catch (error) {

        }

    };
    static async Reset(req: Request, res: Response) {
        try {
            const { } = req.body;
            //verificação dos dados obrigatórios

            //inserir no banco de dados
        } catch (error) {

        }

    };
    static async forgotPassword(req: Request, res: Response) {
        try {
            const { } = req.body;
            //verificação dos dados obrigatórios

            //inserir no banco de dados
        } catch (error) {

        }

    };
}