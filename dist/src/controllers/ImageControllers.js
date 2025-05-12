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
exports.ImageController = void 0;
const client_1 = require("@prisma/client");
const ImageRepository_1 = require("../repositories/ImageRepository");
const prisma = new client_1.PrismaClient();
const imagemRepository = new ImageRepository_1.ImageRepository();
class ImageController {
    getAllImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield imagemRepository.findAll();
                res.json(images);
            }
            catch (error) {
                console.error('Erro ao buscar imagens:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getImageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const images = yield imagemRepository.findById(Number(id));
                if (images) {
                    res.json(images);
                }
                else {
                    res.status(404).json({ message: 'Imagem não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao buscar imagens:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    createImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { immobileId } = req.body;
            const files = req.files;
            const imageUrls = files.map(file => file.firebaseUrl).filter(url => url !== undefined);
            // Validação dos campos obrigatórios
            if (imageUrls.length === 0 || !immobileId) {
                res.status(400).json({
                    message: "Os campos 'url' e 'immobileId' são obrigatórios"
                });
                return;
            }
            // Verifica se o usuário autenticado é um proprietário
            if (req.user.role !== 'owner') {
                res.status(403).json({ message: 'Você não tem permissão para criar imagens' });
                return;
            }
            try {
                const images = yield prisma.image.createMany({
                    data: imageUrls.map(url => ({
                        url: url,
                        immobileId: parseInt(immobileId, 10)
                    }))
                });
                res.status(200).json({ message: 'Imagens criadas com sucesso!' });
            }
            catch (error) {
                console.error('Erro ao criar imagem:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.ImageController = ImageController;
