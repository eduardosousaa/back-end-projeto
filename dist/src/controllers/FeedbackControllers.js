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
exports.FeedbackController = void 0;
const client_1 = require("@prisma/client");
const FeedbackRepository_1 = require("../repositories/FeedbackRepository");
const prisma = new client_1.PrismaClient();
const feedbackRepository = new FeedbackRepository_1.FeedbackRepository();
class FeedbackController {
    getAllFeedbacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbacks = yield feedbackRepository.findAll();
                res.json(feedbacks);
            }
            catch (error) {
                console.error('Erro ao buscar feedbacks:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getFeedbackById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const feedback = yield feedbackRepository.findById(Number(id));
                if (feedback) {
                    res.json(feedback);
                }
                else {
                    res.status(404).json({ message: 'Feedback não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro ao buscar feedback:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    createFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating, comment, userId, immobileId } = req.body;
            if (!rating || !comment || !userId || !immobileId) {
                res.status(400).json({
                    message: "Os campos 'ratting', 'comment', 'userId' e 'immobileId' são obrigatórios! "
                });
                return;
            }
            if (req.user.role !== 'user') {
                res.status(403).json({ message: 'Você não tem permissão para criar feedbacks' });
                return;
            }
            const userP = yield prisma.user.findUnique({
                where: { id: userId }
            });
            if (!userP || userP.role !== 'user') {
                res.status(400).json({ message: 'Usuário inválido' });
                return;
            }
            try {
                const feedback = yield feedbackRepository.create({
                    rating,
                    comment,
                    user: { connect: { id: userId } },
                    immobile: { connect: { id: immobileId } }
                });
                res.status(201).json({ message: 'Feedback criado com sucesso!' });
            }
            catch (error) {
                console.error('Erro ao criar feedback:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    updateFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { rating, comment } = req.body;
                const feedback = yield feedbackRepository.findById(Number(id));
                if (!feedback) {
                    res.status(404).json({ message: 'Feedback não encontrado' });
                    return;
                }
                if (req.user.id !== (feedback === null || feedback === void 0 ? void 0 : feedback.userId)) {
                    res.status(403).json({ message: 'Você não tem permissão para atualizar esse feedback' });
                    return;
                }
                yield feedbackRepository.update(Number(id), { rating, comment });
                res.status(200).json({ message: 'Feedback atualizado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao atualizar feedback:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    deleteFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const feedback = yield feedbackRepository.findById(Number(id));
                if (!feedback) {
                    res.status(404).json({ message: 'Feedback não encontrado' });
                    return;
                }
                if (req.user.id !== (feedback === null || feedback === void 0 ? void 0 : feedback.userId)) {
                    res.status(403).json({ message: 'Você não tem permissão para deletar esse feedback' });
                    return;
                }
                yield feedbackRepository.delete(Number(id));
                res.status(200).json({ message: 'Feedback delatado com sucesso!' });
            }
            catch (error) {
                console.error('Erro ao deletar feedback:', error);
                res.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.FeedbackController = FeedbackController;
