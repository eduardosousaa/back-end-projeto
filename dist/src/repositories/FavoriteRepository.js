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
exports.FavoriteRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FavoriteRepository {
    addFavorite(userId, immobileId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.favorite.create({
                data: {
                    userId,
                    immobileId,
                },
            });
        });
    }
    getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.favorite.findMany({
                where: {
                    userId,
                },
                include: {
                    immobile: {
                        include: {
                            images: true, // Inclui as imagens relacionadas ao imóvel
                        },
                    },
                },
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.favorite.deleteMany({
                where: { id },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.favorite.findUnique({
                where: { id }
            });
        });
    }
}
exports.FavoriteRepository = FavoriteRepository;
