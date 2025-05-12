"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserRepository_1 = require("../repositories/UserRepository");
const jwt_pass = process.env.JWT_PASS;
const email_pass = process.env.EMAIL_PASS;
const email_user = process.env.EMAIL_USER;
const userRepository = new UserRepository_1.UserRepository();
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userRepository.findAll();
                res.json(users);
            }
            catch (error) {
                console.error('Erro ao buscar usuários:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield userRepository.findById(Number(id));
                if (user) {
                    res.json(user);
                }
                else {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao buscar usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, number, role } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({ message: "Os campos 'username', 'email' e 'password' são obrigatórios" });
                return;
            }
            const userFind = yield userRepository.findByEmail(String(email));
            if (userFind) {
                res.status(400).json({ message: 'Email já cadastrado' });
                return;
            }
            if (role !== 'admin' && role !== 'user' && role !== 'owner') {
                res.status(400).json({ message: "O campo 'role' deve ser 'admin', 'user' ou 'owner'" });
                return;
            }
            try {
                const hashP = yield bcryptjs_1.default.hash(String(password), 10);
                const user = yield userRepository.create({ username, email, password: hashP, number, role });
                res.status(200).json({ message: 'Usuário criado com sucesso! ' });
            }
            catch (error) {
                console.error('Erro ao criar usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    signUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email e password são campos obrigatórios' });
                    return;
                }
                const user = yield userRepository.findByEmail(String(email));
                if (!user) {
                    res.status(400).json({ message: 'Usuário não existe' });
                    return;
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(String(password), user.password);
                if (!isPasswordValid) {
                    res.status(400).json({ message: 'Senha incorreta' });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id }, jwt_pass, { expiresIn: '8h' });
                const { password: _ } = user, userLogin = __rest(user, ["password"]);
                res.json({
                    message: "Login efetuado com sucesso!",
                    id: user.id,
                    role: user.role,
                    token
                });
            }
            catch (error) {
                console.error('Erro ao autenticar usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { username, email, password, number, role } = req.body;
                const user = yield userRepository.findById(Number(id));
                if (user) {
                    yield userRepository.update(Number(id), { username, email, password, number, role });
                    res.status(204).json({ message: 'Usuário atualizado com sucesso' });
                }
                else {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield userRepository.findById(Number(id));
                if (user) {
                    yield userRepository.delete(Number(id));
                    res.status(204).json({ message: 'Usuário deletado com sucesso' });
                }
                else {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao deletar usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    sendResetEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ message: "O campo 'email' é obrigatório" });
                }
                const user = yield userRepository.findByEmail(email);
                if (!user) {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                }
                const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, jwt_pass, { expiresIn: '1h' });
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: email_user,
                        pass: email_pass
                    }
                });
                const info = yield transporter.sendMail({
                    from: '"ImoGoat" <imogoat23@gmail.com>',
                    to: email,
                    subject: 'Redefinição de Senha',
                    text: `Clique no link a seguir para redefinir sua senha: `,
                }, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ message: 'Erro ao enviar email' });
                    }
                    else {
                        res.status(200).json({ token });
                    }
                });
            }
            catch (error) {
                console.error('Erro ao enviar email de redefinição:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, novaSenha } = req.body;
                if (!token || !novaSenha) {
                    res.status(400).json({ message: "Os campos 'token' e 'novaSenha' são obrigatórios" });
                    return;
                }
                let decodedToken;
                try {
                    decodedToken = jsonwebtoken_1.default.verify(token, jwt_pass);
                }
                catch (err) {
                    res.status(400).json({ message: 'Token inválido' });
                    return;
                }
                if (!decodedToken || !decodedToken.id) {
                    res.status(400).json({ message: 'Token inválido' });
                    return;
                }
                const user = yield userRepository.findById(decodedToken.id);
                if (!user) {
                    res.status(404).json({ message: 'Usuário não encontrado' });
                    return;
                }
                const hashNewPassword = yield bcryptjs_1.default.hash(novaSenha, 10);
                user.password = hashNewPassword;
                yield userRepository.update(user.id, user);
                res.status(200).json({ message: 'Senha redefinida com sucesso' });
            }
            catch (error) {
                console.error('Erro ao resetar senha:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.UserController = UserController;
