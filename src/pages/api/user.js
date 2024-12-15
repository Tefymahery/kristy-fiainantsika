import { connectToDatabase } from '../../utils/mongodb';
const User = require('../../backend/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    console.log('Requête API reçue :', req.method);
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password; // Hachage nécessaire
    user.role = req.body.role || user.role;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.query.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Handler API principal
export default async function handler(req, res) {
  // Connectez-vous à MongoDB avant toute opération
  await connectToDatabase();
  const { method } = req;

  console.time('API/user execution');
  switch (method) {
    case 'GET':
            await getAllUsers(req, res);
      break;
    case 'POST':
      await createUser(req, res);
      break;
    case 'PUT':
      await updateUser(req, res); // Mise à jour des autres données de l'utilisateur
      break;
    case 'DELETE':
      await deleteUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
