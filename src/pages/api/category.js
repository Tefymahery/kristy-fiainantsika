// backend/controllers/categoryController.js
const Categorie = require('../../backend/models/Categorie');

// Créer une nouvelle catégorie
exports.createCategorie = async (req, res) => {
  try {
    // Vérification si une catégorie avec le même nom existe déjà
    const existingCategory = await Categorie.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà.' });
    }

    // Création de la nouvelle catégorie avec les nouveaux champs isActive et icon
    const newCategorie = new Categorie({
      name: req.body.name,
      description: req.body.description,
      articleCount: req.body.articleCount,
      parentCategory: req.body.parentCategory || null,
      isActive: req.body.isActive || true, // Valeur par défaut : actif
      icon: req.body.icon || 'Bars4Icon' // Valeur par défaut pour l'icône
    });

    await newCategorie.save();
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find().populate('parentCategory');
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Categorie.findById(req.params.id).populate('parentCategory');
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    console.log("Données reçues:", req.body);  // Déboguez les données envoyées par le frontend

    const updatedCategory = await Categorie.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        articleCount: req.body.articleCount,
        parentCategory: req.body.parentCategory || null,
        isActive: req.body.isActive, // Mise à jour de l'état 'isActive'
        icon: req.body.icon // Mise à jour de l'icône
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Supprimer une catégorie avec toutes ses sous-catégories
exports.deleteCategory = async (req, res) => {
  try {
    // Fonction récursive pour supprimer une catégorie et ses sous-catégories
    const deleteCategoryAndChildren = async (categoryId) => {
      // Supprimer toutes les sous-catégories liées à cette catégorie
      const subCategories = await Categorie.find({ parentCategory: categoryId });
      for (const subCategory of subCategories) {
        // Appel récursif pour chaque sous-catégorie
        await deleteCategoryAndChildren(subCategory._id);
      }

      // Supprimer la catégorie actuelle
      await Categorie.findByIdAndDelete(categoryId);
    };

    // Démarrer la suppression récursive avec la catégorie principale
    const categoryToDelete = await Categorie.findById(req.params.id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    await deleteCategoryAndChildren(categoryToDelete._id);

    res.status(200).json({ message: 'Catégorie et toutes ses sous-catégories supprimées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression récursive :', error);
    res.status(400).json({ message: error.message });
  }
};


// Vider la base
exports.deleteAllCategories = async (req, res) => {
  try {
    console.log("Requête reçue pour supprimer toutes les catégories"); // Log
    await Categorie.deleteMany({});
    res.status(200).json({ message: 'Toutes les catégories ont été supprimées avec succès' });
  } catch (error) {
    console.error("Erreur backend : ", error.message); // Log l'erreur
    res.status(400).json({ message: error.message });
  }
};

