"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FavoriteControllers_1 = require("../src/controllers/FavoriteControllers");
const FeedbackControllers_1 = require("../src/controllers/FeedbackControllers");
const ImageControllers_1 = require("../src/controllers/ImageControllers");
const ImmobileControllers_1 = require("../src/controllers/ImmobileControllers");
const UserControllers_1 = require("../src/controllers/UserControllers");
const authMiddleware_1 = require("../src/middlewares/authMiddleware");
const routes = (0, express_1.Router)();
const multer = require('multer');
const uploadImovel = require('./services/firebase.js');
const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10,
        files: 10
    }
});
// Rotas de usuário
routes.get('/user', new UserControllers_1.UserController().getAllUsers);
routes.get('/user/:id', new UserControllers_1.UserController().getUserById);
routes.post('/create-user', new UserControllers_1.UserController().createUser);
routes.post('/login', new UserControllers_1.UserController().signUser);
routes.put('/alter-user/:id', new UserControllers_1.UserController().updateUser);
routes.delete('/delete-user/:id', new UserControllers_1.UserController().deleteUser);
routes.post('/esqueci', new UserControllers_1.UserController().sendResetEmail);
routes.post('/trocarSenha', new UserControllers_1.UserController().resetPassword);
// Rotas de imóveis
routes.get('/immobile/:id', new ImmobileControllers_1.ImmobileController().getImmobileById);
routes.get('/immobile', new ImmobileControllers_1.ImmobileController().getAllImmobiles);
routes.post('/create-immobile', authMiddleware_1.authMiddleware, new ImmobileControllers_1.ImmobileController().createImmobile);
routes.put('/alter-immobile/:id', authMiddleware_1.authMiddleware, new ImmobileControllers_1.ImmobileController().updateImmobile);
routes.delete('/delete-immobile/:id', authMiddleware_1.authMiddleware, new ImmobileControllers_1.ImmobileController().deleteImmobile);
// Rotas de feedback
routes.get('/feedback', new FeedbackControllers_1.FeedbackController().getAllFeedbacks);
routes.get('/feedback/:id', new FeedbackControllers_1.FeedbackController().getFeedbackById);
routes.post('/create-feedback', authMiddleware_1.authMiddleware, new FeedbackControllers_1.FeedbackController().createFeedback);
routes.put('/alter-feedback/:id', authMiddleware_1.authMiddleware, new FeedbackControllers_1.FeedbackController().updateFeedback);
routes.delete('delete-/feedback/:id', authMiddleware_1.authMiddleware, new FeedbackControllers_1.FeedbackController().deleteFeedback);
// Rotas de imagens
routes.post('/create-image', authMiddleware_1.authMiddleware, Multer.array('img', 10), uploadImovel, new ImageControllers_1.ImageController().createImage);
routes.get('/image', new ImageControllers_1.ImageController().getAllImages);
routes.get('/image/:id', new ImageControllers_1.ImageController().getImageById);
// Rotas de favoritos
routes.post('/create-favorites', authMiddleware_1.authMiddleware, new FavoriteControllers_1.FavoriteController().addFavorite);
routes.delete('/delete-favorites/:id', authMiddleware_1.authMiddleware, new FavoriteControllers_1.FavoriteController().deleteFavorite);
routes.get('/favorites/:userId', authMiddleware_1.authMiddleware, new FavoriteControllers_1.FavoriteController().getFavorites);
exports.default = routes;
