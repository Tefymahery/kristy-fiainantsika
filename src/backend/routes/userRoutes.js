// src/backend/routes/userRoutes .js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Créer un utilisateur
router.post('/', userController.createUser);

// Récupérer tous les utilisateurs
router.get('/', userController.getAllUsers);

// Modifier un utilisateur
router.put('/:id', userController.updateUser);

// Route pour mettre à jour l'état de l'utilisateur
router.put('/:id/status', userController.updateUserStatus);

// Supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

module.exports = router;
