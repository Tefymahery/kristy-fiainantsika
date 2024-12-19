import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Card, CardContent, Typography, Grid, Dialog, DialogActions, FormControl, DialogContent, DialogTitle, FormControlLabel, Checkbox, InputAdornment, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { withAuthorization } from '../../utils/authorization'; // Gestion de l'autorisation
import TagsInput from '@/components/admin/TagsInput';
import Image from 'next/image';


const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    titre: '',
    sous_titre: '',
    extrait: '',
    auteur: '',
    image_mise_en_avant: '',
    categorie: '',
    contenu: [],
    tags: [],
    isPublished: false,
    commentOn: true,
    price: 0,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Récupérer les articles depuis l'API
  useEffect(() => {
    axios.get('/api/articles')
      .then((response) => {
        console.log("Articles reçus:", response.data);
        setArticles(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des articles:", error);
      });

      // Récupérer les catégories depuis l'API
    axios.get('/api/category')
    .then((response) => {
        console.log("Catégories reçues :", response.data); // Ajoutez ce log pour inspecter les données
      setCategories(response.data);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories:", error);
    });
  }, []);

  // Créer un nouvel article
  const handleCreateArticle = () => {
    axios.post('/api/articles', newArticle)
      .then((response) => {
        setArticles([...articles, response.data]);
        resetForm();
      })
      .catch((error) => {
        console.error("Erreur lors de la création de l'article:", error);
      });
  };

  // Modifier un article
  // Soumettre les modifications d'un article
  const handleUpdateArticle = (id) => {
    axios
      .put(`/api/articles?id=${id}`, newArticle) // Utilisez `newArticle` car il contient les modifications
      .then((response) => {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === id ? response.data : article
          )
        );
        resetForm();
      })
      .catch((error) => {
        console.error("Erreur lors de la modification de l'article:", error);
      });
  };
  
  const handleEditArticle = (article) => {
    setEditArticle(article); // Stocker l'article à modifier
    setNewArticle({ ...article }); // Copier les données dans `newArticle` pour les modifications
    setImagePreview(article.image_mise_en_avant || ''); // Prévisualisation de l'image
    setShowDialog(true); // Ouvrir le formulaire
  };
  
  

  // Supprimer un article
  const handleDeleteArticle = (id) => {
    axios.delete(`/api/articles?id=${id}`)
      .then(() => {
        setArticles(articles.filter((article) => article._id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'article:", error);
      });
  };



  // Gérer l'ajout ou la modification d'un contenu
  const handleAddContent = (type) => {
    const content = type === 'text' ? { type: 'text', content: '' } : { type: 'image', src: '' };
    setNewArticle({
      ...newArticle,
      contenu: [...newArticle.contenu, content]
    });
  };

  // Fonction de suppression du contenu
    const handleDeleteContent = (index) => {
        const updatedContent = newArticle.contenu.filter((_, i) => i !== index);
        setNewArticle({
        ...newArticle,
        contenu: updatedContent
        });
    };

    

  const handleChangeContent = (index, field, value) => {
    const updatedContent = [...newArticle.contenu];
    updatedContent[index][field] = value;
    setNewArticle({ ...newArticle, contenu: updatedContent });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewArticle({
      titre: '',
      sous_titre: '',
      extrait: '',
      auteur: '',
      image_mise_en_avant: '',
      categorie: '',
      contenu: [],
      tags: [],
      isPublished: false,
      commentOn: true,
      price: 0,
    });
    setImagePreview('');
    setShowDialog(false);
  };

   // Gérer les tags
   // Gérer l'ajout ou la modification des tags
  const handleTagsChange = (tags) => {
    setNewArticle({ ...newArticle, tags });
  };

     
  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => setShowDialog(true)}>Ajouter un article</Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{article.titre}</Typography>
                <Typography variant="body2" color="textSecondary">{article.sous_titre}</Typography>
                <Button onClick={() => handleEditArticle(article)}>Modifier</Button>
                <Button onClick={() => handleDeleteArticle(article._id)}>Supprimer</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de création ou édition d'un article */}
      <Dialog open={showDialog} onClose={() => resetForm()}>
        <DialogTitle>{editArticle ? "Modifier l'article" : "Ajouter un article"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            fullWidth
            value={newArticle.titre}
            onChange={(e) => setNewArticle({ ...newArticle, titre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sous-titre"
            fullWidth
            value={newArticle.sous_titre}
            onChange={(e) => setNewArticle({ ...newArticle, sous_titre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Extrait"
            fullWidth
            multiline
            rows={4}
            value={newArticle.extrait}
            onChange={(e) => setNewArticle({ ...newArticle, extrait: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Auteur"
            fullWidth
            value={newArticle.auteur}
            onChange={(e) => setNewArticle({ ...newArticle, auteur: e.target.value })}
            sx={{ mb: 2 }}
          />

        {/* gestion de la catégorie */}
        <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="categorie-label">Catégorie</InputLabel>
        <Select
            labelId="categorie-label"
            value={newArticle.categorie}
            onChange={(e) => setNewArticle({ ...newArticle, categorie: e.target.value })}
            label="Catégorie"
        >
            {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
                {category.name}
            </MenuItem>
            ))}
        </Select>
        </FormControl>


          <TextField
            label="Image de mise en avant"
            fullWidth
            value={newArticle.image_mise_en_avant}
            onChange={(e) => {
              setNewArticle({ ...newArticle, image_mise_en_avant: e.target.value });
              setImagePreview(e.target.value);
            }}
            sx={{ mb: 2 }}
          />
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
                <Image
                src={imagePreview.startsWith('/') ? imagePreview : `/${imagePreview}`} // Ajoute un slash si nécessaire
                alt="Image de mise en avant"
                width={800}  // Spécifie la largeur de l'image (ajuste selon la taille souhaitée)
                height={300} // Spécifie la hauteur de l'image (ajuste selon la taille souhaitée)
                style={{ objectFit: 'cover' }} // Maintient l'aspect de l'image tout en couvrant la zone spécifiée
                layout="intrinsic"  // Ou "responsive" si tu veux que l'image s'adapte
                 />
            </Box>
            )}
          {/* Gestion des contenus */}
          {newArticle.contenu.map((item, index) => (
            <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1">{item.type === 'text' ? 'Texte' : 'Image'}</Typography>
                
                {item.type === 'text' ? (
                <TextField
                    label="Contenu du texte"
                    fullWidth
                    value={item.content}
                    onChange={(e) => handleChangeContent(index, 'content', e.target.value)}
                />
                ) : (
                <TextField
                    label="URL de l'image"
                    fullWidth
                    value={item.src}
                    onChange={(e) => handleChangeContent(index, 'src', e.target.value)}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                    }}
                />
                )}

                {/* Bouton de suppression */}
                <Button
                sx={{ ml: 2 }}
                color="error"
                onClick={() => handleDeleteContent(index)}
                >
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>×</span> {/* Croix */}
                </Button>
            </Box>
            ))}

          <Button variant="outlined" onClick={() => handleAddContent('text')} sx={{ mr: 2 }}>Ajouter un texte</Button>
          <Button variant="outlined" onClick={() => handleAddContent('image')}>Ajouter une image</Button>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newArticle.isPublished}
                  onChange={(e) => setNewArticle({ ...newArticle, isPublished: e.target.checked })}
                />
              }
              label="Publié"
            />
          </Box>
          <TextField
            label="Prix"
            fullWidth
            type="number"
            value={newArticle.price}
            onChange={(e) => setNewArticle({ ...newArticle, price: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
           {/* Champ pour les tags */}
           {/* Gestion des tags */}
          <TagsInput tags={newArticle.tags} setTags={handleTagsChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={resetForm} color="secondary">Annuler</Button>
            <Button
                onClick={() => {
                if (editArticle) {
                    handleUpdateArticle(editArticle._id); // Mise à jour si `editArticle` est défini
                } else {
                    handleCreateArticle(); // Ajout sinon
                }
                }}
                color="primary"
            >
                {editArticle ? 'Modifier' : 'Ajouter'}
            </Button>
            </DialogActions>

      </Dialog>
    </Box>
  );
};
// Protection de la page
export const getServerSideProps = withAuthorization(['admin', 'editor']);

export default AdminArticles;
