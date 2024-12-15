import { connectToDatabase } from '../../../../utils/mongodb'; // Ajustez le chemin si nécessaire
const User = require('../../../../backend/models/User'); // Ajustez également

// Mettre à jour le statut de l'utilisateur
const updateUserStatus = async (req, res) => {
  try {
    // Connectez-vous à MongoDB avant toute opération
    await connectToDatabase();
    const { id } = req.query; // Récupérer l'ID de l'utilisateur depuis la query
    const { isActive } = req.body; // Récupérer le statut de l'utilisateur depuis le body

    const user = await User.findById(id); // Chercher l'utilisateur dans la base de données
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.isActive = isActive; // Mettre à jour le statut
    await user.save(); // Sauvegarder les modifications

    res.status(200).json({ message: 'Statut de l\'utilisateur mis à jour avec succès', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default updateUserStatus;
