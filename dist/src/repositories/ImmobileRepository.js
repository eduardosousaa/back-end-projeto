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
exports.ImmobileRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ImmobileRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.immobile.findMany({
                include: {
                    proprietary: true,
                    feedbacks: true,
                    images: true
                }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.immobile.findUnique({
                where: { id },
                include: {
                    proprietary: true,
                    feedbacks: true,
                    images: true
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return prisma.immobile.create({
                data: Object.assign(Object.assign({}, data), { proprietary: {
                        connect: { id: (_a = data.proprietary.connect) === null || _a === void 0 ? void 0 : _a.id }
                    } })
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.immobile.update({
                where: { id },
                data
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.immobile.delete({
                where: { id }
            });
        });
    }
}
exports.ImmobileRepository = ImmobileRepository;
