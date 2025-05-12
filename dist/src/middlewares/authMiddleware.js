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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const UserRepository_1 = require("../repositories/UserRepository");
const jwt_pass = process.env.JWT_PASS;
const userRepository = new UserRepository_1.UserRepository();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return res.status(401).json({ message: 'Não autorizado' });
        }
        const token = authorization.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, jwt_pass);
        const user = yield userRepository.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'Não autorizado' });
        }
        const { password: _ } = user, loggedUser = __rest(user, ["password"]);
        req.user = loggedUser;
        next();
    }
    catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ message: 'Não autorizado' });
    }
});
exports.authMiddleware = authMiddleware;
