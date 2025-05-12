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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({
                where: { id }
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({
                where: { email }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    number: data.number,
                    role: data.role
                }
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.update({
                where: { id },
                data
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.delete({
                where: { id }
            });
        });
    }
}
exports.UserRepository = UserRepository;
