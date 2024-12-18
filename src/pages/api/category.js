import { connectToDatabase } from '../../utils/mongodb';
import Category from '../../backend/models/Categorie';

// Créer une nouvelle catégorie
const createCategory = async (req, res) => {
  try {
    const { name, description, articleCount, parentCategory, isActive, icon } = req.body;

    // Vérification si une catégorie avec le même nom existe déjà
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà.' });
    }

    // Création de la nouvelle catégorie
    const newCategory = new Category({
      name,
      description,
      articleCount,
      parentCategory: parentCategory || null,
      isActive: isActive !== undefined ? isActive : true, // Actif par défaut
      icon: icon || 'Bars4Icon', // Icône par défaut
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir toutes les catégories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory');
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, description, articleCount, parentCategory, isActive, icon } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, articleCount, parentCategory, isActive, icon },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une catégorie avec toutes ses sous-catégories
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;

    // Fonction récursive pour supprimer une catégorie et ses sous-catégories
    const deleteCategoryAndChildren = async (categoryId) => {
      const subCategories = await Category.find({ parentCategory: categoryId });
      for (const subCategory of subCategories) {
        await deleteCategoryAndChildren(subCategory._id);
      }
      await Category.findByIdAndDelete(categoryId);
    };

    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    await deleteCategoryAndChildren(categoryToDelete._id);

    res.status(200).json({ message: 'Catégorie et sous-catégories supprimées avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer toutes les catégories
const deleteAllCategories = async (req, res) => {
  try {
    await Category.deleteMany({});
    res.status(200).json({ message: 'Toutes les catégories ont été supprimées avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Gestionnaire principal
export default async function handler(req, res) {
  await connectToDatabase(); // Connexion à MongoDB
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.query.id) {
        await getCategoryById(req, res); // Récupérer une catégorie spécifique
      } else {
        await getAllCategories(req, res); // Récupérer toutes les catégories
      }
      break;
    case 'POST':
      await createCategory(req, res);
      break;
    case 'PUT':
      await updateCategory(req, res);
      break;
    case 'DELETE':
      if (req.query.id) {
        await deleteCategory(req, res); // Supprimer une catégorie spécifique
      } else {
        await deleteAllCategories(req, res); // Supprimer toutes les catégories
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
