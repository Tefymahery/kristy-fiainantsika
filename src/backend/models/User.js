const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'editor', 'registered', 'guest'],
    default: 'guest'
  },
  isActive: {
    type: Boolean,
    default: true  // L'utilisateur est actif par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date  // Date de dernière connexion, utile pour la gestion des utilisateurs
  }
});

// Avant de sauvegarder l'utilisateur, hasher le mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);  // Le niveau de sécurité (plus élevé = plus sûr mais plus lent)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparer le mot de passe lors de la connexion
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Vérifiez si le modèle est déjà défini avant de le recréer
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
