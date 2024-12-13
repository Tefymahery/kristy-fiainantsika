// backend/models/Categorie.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ajout de l'option unique pour garantir l'unicité
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
    ref: 'Category', // Référence à une autre catégorie
    default: null
  },
  isActive: {
    type: Boolean,
    default: true, // Valeur par défaut : actif
  },
  icon: {
    type: String,  // On peut stocker l'URL de l'icône ou le nom d'une icône si tu utilises une bibliothèque comme FontAwesome
    default: 'default-icon',  // Par défaut, on peut mettre une icône générique
  }
});

module.exports = mongoose.model('Category', categorySchema);
