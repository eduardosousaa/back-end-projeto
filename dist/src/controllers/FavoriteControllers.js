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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const FavoriteRepository_1 = require("../repositories/FavoriteRepository");
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const favoriteRepository = new FavoriteRepository_1.FavoriteRepository();
class FavoriteController {
    addFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, immobileId } = req.body;
            if (!userId || !immobileId) {
                res.status(400).json({ message: "Os campos 'userId' e 'immobileId' são obrigatórios!" });
                return;
            }
            // if (req.user.role !== 'user') {
            //   res.status(403).json({ message: 'Você não tem permissão para favoritar um imóvel!' });
            //   return;
            // }
            const userP = yield prismaClient_1.default.user.findUnique({
                where: { id: userId }
            });
            // if (!userP || userP.role !== 'user') {
            //   res.status(400).json({ message: 'Usuário inválido' });
            //   return;
            // }
            const immobile = yield prismaClient_1.default.immobile.findUnique({
                where: { id: immobileId }
            });
            if (!immobile) {
                res.status(400).json({ message: 'Imóvel inválido' });
                return;
            }
            try {
                const verificaFavorite = yield prismaClient_1.default.favorite.findUnique({
                    where: {
                        userId_immobileId: {
                            userId,
                            immobileId,
                        },
                    },
                });
                if (verificaFavorite) {
                    res.status(409).json({ message: 'Imóvel já foi favoritado' });
                    return;
                }
                yield favoriteRepository.addFavorite(userId, immobileId);
                res.status(200).json({ message: 'Imóvel favoritado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao favoritar imóvel:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    deleteFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const favorite = yield favoriteRepository.findById(Number(id));
                if (!favorite) {
                    res.status(404).json({ message: 'Favorito não encontrado' });
                    return;
                }
                if (req.user.id !== (favorite === null || favorite === void 0 ? void 0 : favorite.userId)) {
                    res.status(403).json({ message: 'Você não tem permissão para deletar esse feedback' });
                    return;
                }
                yield favoriteRepository.delete(Number(id));
                res.status(200).json({ message: 'Favorito delatado com sucesso!' });
            }
            catch (error) {
                console.error('Erro ao deletar favorito:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    // async deleteFavorite(req: Request, res: Response): Promise<void> {
    //   const { userId, immobileId } = req.body;
    //   if (!userId || !immobileId) {
    //     res.status(400).json({ message: "Os campos 'userId' e 'immobiledId' são obrigatórios!" });
    //     return;
    //   }
    //   if (req.user.role !== 'user' || req.user.id !== userId) {
    //     res.status(403).json({ message: 'Você não tem permissão para desfavoritar um imóvel!' });
    //     return;
    //   }
    //   const favorite = await prisma.favorite.findUnique({
    //     where: {
    //       userId_immobileId: {
    //         userId: Number(userId),
    //         immobileId: Number(immobileId),
    //       },
    //     },
    //   });
    //   if (!favorite) {
    //     res.status(404).json({ message: 'Favorito não encontrado' });
    //     return;
    //   }
    //   try {
    //     await favoriteRepository.removeFavorite(userId, immobileId);
    //     res.status(200).json({ message: 'Imóvel desfavoritado com sucesso' });
    //   } catch (error) {
    //     console.error('Erro ao desfavoritar imóvel:', error);
    //     res.status(500).json({ message: 'Erro interno do servidor' });
    //   }
    // }
    getFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const favorites = yield favoriteRepository.getFavorites(Number(userId));
                if (!favorites || favorites.length === 0) {
                    res.status(404).json({ message: 'Nenhum favorito encontrado' });
                    return;
                }
                res.status(200).json(favorites);
            }
            catch (error) {
                console.error('Erro ao buscar imóveis favoritados:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.FavoriteController = FavoriteController;
