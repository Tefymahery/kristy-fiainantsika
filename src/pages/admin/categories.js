import { useState, useEffect } from 'react';
import axios from 'axios';
import { withAuthorization } from '../../utils/authorization'; // Gestion de l'autorisation
import { 
  FaTrash, 
  FaUndo, 
  FaPlus,
  FaPen  
} from 'react-icons/fa';

// Import Material UI components
import {
  Button,
  Box,
  TextField,
  IconButton,
  Switch,
  Dialog,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentCategory: null,
    articleCount: 0,
    isActive: true,
    image: '',
  });
  const [editCategory, setEditCategory] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const API_URL = "/api/category";

  useEffect(() => {
    axios.get(API_URL)
    .then(response => {
      console.log("Catégories récupérées:", response.data);  // Ajoutez ce log pour voir les données
      setCategories(response.data);
    })
    .catch(error => console.error("Erreur lors de la récupération des catégories:", error));
  }, []);

  useEffect(() => {
    // Trie les catégories chaque fois que `categories` change
    const updatedSortedCategories = sortCategories(categories);
    setSortedCategories(updatedSortedCategories);
  }, [categories]); // Ce useEffect dépend de `categories`

  const handleCreateCategory = () => {
    axios.post(API_URL, newCategory)
      .then(() => {
        axios.get(API_URL) // Récupère les données mises à jour après ajout
          .then(response => {
            setCategories(response.data);
          })
          .catch(error => console.error("Erreur lors de la mise à jour des catégories:", error));
        setNewCategory({ name: '', description: '', parentCategory: null, articleCount: 0, isActive: true, image: '' });
        setShowDialog(false);
      })
      .catch(error => console.error("Erreur lors de la création de la catégorie:", error));
  };
  
  const handleUpdateCategory = (id) => {
    axios.put(`${API_URL}?id=${id}`, editCategory)
      .then(() => {
        axios.get(API_URL) // Récupère les données mises à jour après modification
          .then(response => {
            setCategories(response.data);
          })
          .catch(error => console.error("Erreur lors de la mise à jour des catégories:", error));
        setEditCategory(null);
        setShowDialog(false);
      })
      .catch(error => console.error("Erreur lors de la modification de la catégorie:", error));
  };
  
   

  const handleDeleteCategory = () => {
    //`/api/user?id=${userId}`
    axios.delete(`/api/category?id=${categoryToDelete}`)
      .then(() => {
        setCategories(categories.filter(category => category._id !== categoryToDelete));
        setShowDeleteDialog(false);
        alert('La catégorie et ses sous-catégories ont été supprimées avec succès');
      })
      .catch(error => {
        console.error(error);
        alert('Erreur lors de la suppression de la catégorie');
      });
  };

  const handleClearCategories = () => {
    axios.delete(`${API_URL}`)
      .then(() => {
        setCategories([]);
        setShowClearDialog(false);
        alert('Toutes les catégories ont été supprimées avec succès');
      })
      .catch(error => {
        console.error(error);
        alert('Erreur lors de la suppression de toutes les catégories');
      });
  };

  const sortCategories = (categories) => {
        const sortedCategories = [];
  
    const addCategory = (parentId = null, depth = 0) => {
      //console.log(`Ajout des catégories pour parentId: ${parentId} à profondeur ${depth}`);
      
      // Correction du filtre pour gérer les catégories racines et les sous-catégories
      categories
        .filter(category => {
          // Comparer par _id ou vérifier si la catégorie est racine (parentCategory === null)
          return (category.parentCategory === null && parentId === null) || 
                 (category.parentCategory && category.parentCategory._id === parentId);
        })
        .forEach(category => {
          //console.log(`Catégorie ajoutée: ${category.name}, profondeur: ${depth}`);
          sortedCategories.push({ ...category, depth });
          addCategory(category._id, depth + 1);  // Appel récursif pour les sous-catégories
        });
    };
  
    addCategory();
    console.log('Catégories triées:', sortedCategories);
    console.log('Catégories non triés apres triage:', categories);
    return sortedCategories;
  };
  

  //const sortedCategories = sortCategories(categories);
  

  const renderCategoryTree = (parentId = null, depth = 0) => {
    console.log('Catégories triées avant traitement dans renderCategoryTree: ', sortedCategories);
    return sortedCategories  // Utiliser sortedCategories au lieu de categories
      .filter(category => 
        // Comparer _id de parentCategory avec parentId
        (category.parentCategory === null && parentId === null) || 
        (category.parentCategory && category.parentCategory._id === parentId)
      )
      .map(category => (
        <div key={category._id} style={{ marginLeft: depth * 16, marginBottom: 8 }}>
          <Typography variant="h6">
            {category.name}
          </Typography>
  
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tooltip title="Modifier la catégorie" arrow>
              <IconButton
                size="small"
                color="warning"
                onClick={() => {
                  setEditCategory(category);
                  setShowDialog(true);
                }}
              >
                <FaPen />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer la catégorie" arrow> 
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setCategoryToDelete(category._id);
                  setShowDeleteDialog(true);
                }}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
          {renderCategoryTree(category._id, depth + 1)}  {/* Appel récursif pour afficher les sous-catégories */}
          
        </div>
        
      ));
  };
  
  

  return (
    <Box sx={{
      p: 4,
      backgroundColor: (theme) => theme.palette.background.default, // Fond adapté au thème
      color: (theme) => theme.palette.text.primary, // Texte adapté au thème
      border: (theme) => `1px solid ${theme.palette.divider}`, // Bordure adaptée au thème
      boxShadow: (theme) => theme.shadows[1], // Ombre adaptée au thème
    }}>
      <Card>
        <CardHeader
          sx={{ 
               p: 2,
          }}
          title={
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
              }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Gestion des Catégories
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FaPlus />}
                  onClick={() => {
                    setShowDialog(true);
                    setEditCategory(null);
                  }}
                >
                  Créer une catégorie
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTrash />}
                  onClick={() => setShowClearDialog(true)}
                >
                  Vider toutes les catégories
                </Button>
              </Box>
            </Box>
          }
        />

        <CardContent>{renderCategoryTree()}</CardContent>
      </Card>

      {/* Dialog for creating/editing category */}
      <Dialog 
        open={showDialog} 
        onClose={() => setShowDialog(false)}
        PaperProps={{
          sx: {
            width: "600px", // Largeur spécifique
            maxWidth: "90%", // Largeur maximale basée sur le viewport
            height: "80vh", // Hauteur relative à la taille du viewport
          },
        }}
        >
        <DialogTitle>
          {editCategory ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
        </DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
          overflow: 'auto',
          gap: 2,
          padding: 3
          }}>
          
          <TextField
            label="Nom de la catégorie"
            value={editCategory ? editCategory.name : newCategory.name}
            onChange={(e) =>
              editCategory
                ? setEditCategory({ ...editCategory, name: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            value={editCategory ? editCategory.description : newCategory.description}
            onChange={(e) =>
              editCategory
                ? setEditCategory({ ...editCategory, description: e.target.value })
                : setNewCategory({ ...newCategory, description: e.target.value })
            }
          />

          <TextField
            label="Nombre d'articles"
            type="number"
            value={editCategory ? editCategory.articleCount : newCategory.articleCount}
            onChange={(e) =>
              editCategory
                ? setEditCategory({ ...editCategory, articleCount: e.target.value })
                : setNewCategory({ ...newCategory, articleCount: e.target.value })
            }
          />

          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            value={editCategory ? editCategory.image : newCategory.image}
            onChange={(e) =>
              editCategory
                ? setEditCategory({ ...editCategory, image: e.target.value })
                : setNewCategory({ ...newCategory, image: e.target.value })
            }
          />


          <FormControl>
            <InputLabel>Catégorie parente</InputLabel>
            <Select
              label="Catégorie parente"
              value={editCategory ? (editCategory.parentCategory || '') : (newCategory.parentCategory || '')}
              onChange={(e) =>
                editCategory
                  ? setEditCategory({ ...editCategory, parentCategory: e.target.value })
                  : setNewCategory({ ...newCategory, parentCategory: e.target.value })
              }
            >
              <MenuItem value={null}>Aucune</MenuItem>
              {sortedCategories
                .filter((c) => c._id !== (editCategory ? editCategory._id : null))
                .map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={editCategory ? editCategory.isActive : newCategory.isActive}
              onChange={(e) =>
                editCategory
                  ? setEditCategory({ ...editCategory, isActive: e.target.checked })
                  : setNewCategory({ ...newCategory, isActive: e.target.checked })
              }
            />
            <Typography sx={{ ml: 2 }}>Actif</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={
              editCategory
                ? () => handleUpdateCategory(editCategory._id)
                : handleCreateCategory
            }
            color="primary"
          >
            {editCategory ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting a category */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette catégorie ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteCategory} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for clearing all categories */}
      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer toutes les catégories ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleClearCategories} color="error">
            Supprimer toutes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Protection de la page
export const getServerSideProps = withAuthorization(['admin', 'editor']);

export default AdminCategories;
