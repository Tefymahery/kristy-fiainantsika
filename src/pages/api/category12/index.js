import Categorie from '../../../backend/models/Categorie';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
    // Connectez-vous à MongoDB avant toute opération
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const categories = await Categorie.find().populate('parentCategory');
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const existingCategory = await Categorie.findOne({ name: req.body.name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà.' });
      }

      const newCategory = new Categorie(req.body);
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
