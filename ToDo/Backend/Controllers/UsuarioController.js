// Importando Model
import Usuario from "../Models/Usuario.js";
// import argon2 from "argon2"; <- Preferência para esse
// Segunda alternativa
import { hash, verify } from "@node-rs/argon2";
import jwt from "jsonwebtoken";

export default class UsuarioController {
    static async Create(req, res) {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(422).json({ message: "Todos os campos são obrigatórios" })
        }
        try {
            // const hashPassword = await argon2.hash(senha);  <- Preferência para esse
            // Segunda alternativa
            const hashPassword = await hash(senha);
            // Objeto para inserir os dados
            const usuario = new Usuario({
                nome,
                email,
                senha: hashPassword,
            });
            const novoUsuario = await usuario.save();
            res.status(200).json({
                message: "Usuário inserido com sucesso!", novoUsuario
            });
            return;
        } catch (error) {
            return res.status(500).json({
                message: "Problema ao inserir um usuário", error
            });
        }
    } // Fim Create
    static async Login(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(422).json({ message: "Todos os campos são obrigatórios" })
        }
        try {
            // Consulta o banco para encontrar o Usuário para logar
            const usuario = await Usuario.findOne(email).select("+senha");
            if (!usuario) {
                return res.status(400).json({ message: "Credenciais Inválidas" })
            }
            // Primeira Alternativa
            // const senhaValida = await argon2.verify(usuario.senha, senha)
            // Segunda Alternativa
            const senhaValida = await verify(usuario.senha, senha)
            if (!senhaValida) {
                return res.status(400).json({ message: "Credenciais Inválidas" })
            }
            const tokenPayLoad = {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            };
            const token = jwt.sign(tokenPayLoad, JWT_SECRET, { expiresIn: "1h" })
            res.cookie("token", token, {
                httpOnly: true, // evita acesso por script JS
                secure: "false", // tornar true em produção exige https
                sameSite: "lax",// comunicação entre front e back
                maxAge: JWT_EXPIRATION_MS || 3600000 // 1h
            });
            return res.status(200).json({
                message: "Login efetuado com sucesso",
                usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token
            })
        } catch (error) {
            return res.status(500).json({
                message: "Problema ao efetuar o Login", error
            });
        }
    } // Fim Login
}