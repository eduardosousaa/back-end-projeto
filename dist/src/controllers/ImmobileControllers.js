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
exports.ImmobileController = void 0;
const client_1 = require("@prisma/client");
const ImmobileRepository_1 = require("../repositories/ImmobileRepository");
const immobileRepository = new ImmobileRepository_1.ImmobileRepository();
const prisma = new client_1.PrismaClient();
class ImmobileController {
    getAllImmobiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const immobiles = yield immobileRepository.findAll();
                res.json(immobiles);
            }
            catch (error) {
                console.error('Erro ao buscar imóveis:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getImmobileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const immobile = yield immobileRepository.findById(Number(id));
                if (immobile) {
                    res.json(immobile);
                }
                else {
                    res.status(404).json({ message: 'Imóvel não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao buscar imóvel:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    createImmobile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, number, type, location, bairro, city, reference, value, numberOfBedrooms, numberOfBathrooms, garagem, description, proprietaryId } = req.body;
            if (req.user.role == 'user') {
                res.status(403).json({ message: 'Você não tem permissão para criar imóveis' });
                return;
            }
            // const owner = await prisma.user.findUnique({
            //   where: { id: Number(proprietaryId) }
            // });
            // if (!owner || owner.role !== 'owner') {
            //   res.status(400).json({ message: 'Usuário proprietário inválido' });
            //   return;
            // }
            try {
                const immobile = yield prisma.immobile.create({
                    data: {
                        name,
                        number: Number(number),
                        type,
                        location,
                        bairro,
                        city,
                        reference,
                        value: Number(value),
                        numberOfBedrooms: Number(numberOfBedrooms),
                        numberOfBathrooms: Number(numberOfBathrooms),
                        garagem: Boolean(garagem),
                        description,
                        proprietary: {
                            connect: { id: Number(proprietaryId) }
                        }
                    }
                });
                res.status(200).json({ message: 'Imóvel criado com sucesso! ' });
            }
            catch (error) {
                console.error('Erro ao criar imóvel:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    updateImmobile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, number, type, location, bairro, city, reference, value, numberOfBedrooms, numberOfBathrooms, garagem, description } = req.body;
                const immobile = yield immobileRepository.findById(Number(id));
                if (!immobile) {
                    res.status(404).json({ message: 'Imóvel não encontrado' });
                    return;
                }
                if (req.user.id !== immobile.proprietaryId) {
                    res.status(403).json({ message: 'Você não tem permissão para atualizar este imóvel' });
                    return;
                }
                const updatedImmobile = yield prisma.immobile.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                        number: Number(number),
                        type,
                        location,
                        bairro,
                        city,
                        reference,
                        value: Number(value),
                        numberOfBedrooms: Number(numberOfBedrooms),
                        numberOfBathrooms: Number(numberOfBathrooms),
                        garagem: Boolean(garagem),
                        description
                    },
                });
                res.status(200).json({ message: 'Imóvel atualizado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao atualizar imóvel:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    deleteImmobile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const immobile = yield immobileRepository.findById(Number(id));
                if (!immobile) {
                    res.status(404).json({ message: 'Imóvel não encontrado' });
                    return;
                }
                if (req.user.id !== immobile.proprietaryId && req.user.role !== 'admin') {
                    res.status(403).json({ message: 'Você não tem permissão para deletar este imóvel' });
                    return;
                }
                yield immobileRepository.delete(Number(id));
                res.status(200).json({ message: 'Imóvel deletado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao deletar imóvel:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.ImmobileController = ImmobileController;
