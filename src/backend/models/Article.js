const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titre: String,
  sous_titre: String,
  extrait: String,
  auteur: String,
  date_ajout: { type: Date, default: Date.now },
  image_mise_en_avant: String,
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie' },
  contenu: [
    {
      type: { type: String, enum: ['text', 'image'], required: true },
      content: String,   // Pour le texte
      src: String,       // Pour les images
    },
  ],
  tags: [String],
  date_modification: Date,
  date_publication: Date,
  isPublished: Boolean,
  commentOn: Boolean,
  like: { type: Number, default: 0 },
  nombre_de_partage: { type: Number, default: 0 },
  price: { type: Number, default: 0 },  // Gratuit ou payant
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
