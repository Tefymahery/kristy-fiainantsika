// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categoryController');

// Routes pour les catégories
router.post('/', categorieController.createCategorie);
router.get('/', categorieController.getAllCategories);
router.get('/:id', categorieController.getCategoryById);
router.put('/:id', categorieController.updateCategory);
router.delete('/all', categorieController.deleteAllCategories); // Spécifique en premier // Route pour vider toutes les catégories
router.delete('/:id', categorieController.deleteCategory);

module.exports = router;
