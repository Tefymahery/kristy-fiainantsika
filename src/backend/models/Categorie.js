// backend/models/Categorie.js
const mongoose = require('mongoose');

// Définir un schéma pour la catégorie
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est obligatoire'],
    unique: true, // Assurer l'unicité du nom
  },
  description: {
    type: String,
    default: '', // Valeur par défaut, peut être vide
  },
  articleCount: {
    type: Number,
    default: 0, // Valeur par défaut
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Référence à une autre catégorie pour les sous-catégories
    default: null
  },
  isActive: {
    type: Boolean,
    default: true, // La catégorie est active par défaut
  },
  image: {
    type: String, // Stockage de l'URL de l'image
    default: 'default-image-url', // Valeur par défaut si aucune image n'est fournie
  }
});

// Vérification si le modèle existe déjà pour éviter l'erreur "OverwriteModelError"
let Category;
try {
  Category = mongoose.model('Category');
} catch (error) {
  // Si le modèle n'existe pas, le créer
  Category = mongoose.model('Category', categorySchema);
}

module.exports = Category;
