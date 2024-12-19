import { connectToDatabase } from '../../utils/mongodb';
import Article from '../../backend/models/Article';
import Category from '../../backend/models/Categorie'; // Assurez-vous que le chemin est correct


// Créer un nouvel article
const createArticle = async (req, res) => {
  try {
    // Log des données reçues
    console.log('Données reçues:', req.body);

    const { titre, sous_titre, extrait, auteur, image_mise_en_avant, categorie, contenu, tags, isPublished, commentOn, price } = req.body;

    // Assurer que 'contenu' est bien un tableau d'objets avec les bonnes propriétés
    const formattedContent = contenu.map(item => {
      if (item.type === 'text') {
        return { type: 'text', content: item.content }; // Contenu de type texte
      } else if (item.type === 'image') {
        return { type: 'image', src: item.src }; // Contenu de type image
      }
      return null; // Si le type n'est pas valide, on ignore l'élément
    }).filter(item => item !== null); // Filtrer les éléments invalides (si nécessaire)

    // Log du contenu formaté
    console.log('Contenu formaté:', formattedContent);

    const newArticle = new Article({
      titre,
      sous_titre,
      extrait,
      auteur,
      image_mise_en_avant,
      categorie,
      contenu: formattedContent,  // Utilisation du contenu formaté
      tags,
      isPublished,
      commentOn,
      price,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'article', error });
  }
};

// Obtenir tous les articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('categorie') // Populer la catégorie pour chaque article
      .sort({ date_ajout: -1 }); // Trier par date d'ajout (le plus récent en premier)
      console.log(articles); // Vérifiez le contenu dans la console
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des articles', error });
  }
};


// Mettre à jour un article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.query;
    const { titre, sous_titre, extrait, auteur, image_mise_en_avant, categorie, contenu, tags, isPublished, commentOn, price } = req.body;

    // Assurer que 'contenu' est bien un tableau d'objets avec les bonnes propriétés
    const formattedContent = contenu.map(item => {
      if (item.type === 'text') {
        return { type: 'text', content: item.content }; // Contenu de type texte
      } else if (item.type === 'image') {
        return { type: 'image', src: item.src }; // Contenu de type image
      }
      return null;
    }).filter(item => item !== null); // Filtrer les éléments invalides

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { titre, sous_titre, extrait, auteur, image_mise_en_avant, categorie, contenu: formattedContent, tags, isPublished, commentOn, price },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'article', error });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article', error });
  }
};

// Gestionnaire principal
export default async function handler(req, res) {
  await connectToDatabase(); // Connexion à MongoDB
  const { method } = req;

  switch (method) {
    case 'GET':
      await getAllArticles(req, res); // Récupérer tous les articles
      break;
    case 'POST':
      await createArticle(req, res); // Créer un nouvel article
      break;
    case 'PUT':
      await updateArticle(req, res); // Mettre à jour un article
      break;
    case 'DELETE':
      await deleteArticle(req, res); // Supprimer un article spécifique
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Méthode ${method} non autorisée`);
  }
}
