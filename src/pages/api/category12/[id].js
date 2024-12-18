import Categorie from '../../../backend/models/Categorie';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
    // Connectez-vous à MongoDB avant toute opération
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const category = await Categorie.findById(id).populate('parentCategory');
      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedCategory = await Categorie.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedCategory = await Categorie.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
