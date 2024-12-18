import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Button, 
  Switch, 
  MenuItem, 
  Tooltip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import { parse } from 'cookie';
//import jwt from 'jsonwebtoken';
import { withAuthorization } from '../../utils/authorization'; // Gestion de l'autorisation

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    articleCount: 0,
    parentCategory: '',
    icon: '', // Pour l'image
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fonction pour récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ouverture du formulaire pour ajouter ou modifier une catégorie
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      articleCount: category.articleCount || 0,
      parentCategory: category.parentCategory || '',
      icon: category.icon || '',
    });
    setIsDialogOpen(true);
  };

  // Supprimer une catégorie
  const handleDelete = (categoryId) => {
    setConfirmAction(() => async () => {
      try {
        await axios.delete(`/api/category?id=${categoryId}`);
        fetchCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error);
      }
    });
    setIsConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: '',
      articleCount: 0,
      parentCategory: '',
      icon: '',
    });
  };

  const handleSave = () => {
    const saveCategory = async () => {
      try {
        if (currentCategory._id) {
          await axios.put(`/api/category?id=${currentCategory._id}`, formData);
        } else {
          await axios.post('/api/category', formData);
        }
        fetchCategories();
        handleDialogClose();
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la catégorie :', error);
      }
    };

    setConfirmAction(() => saveCategory);
    setIsConfirmDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Confirmation de l'action
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestion des catégories
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleEdit({})}>
        Ajouter une catégorie
      </Button>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Articles</TableCell>
              <TableCell>Actif</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.articleCount}</TableCell>
                <TableCell>
                  <Switch
                    checked={category.isActive}
                    onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.checked } })}
                    name="isActive"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Modifier la catégorie" arrow>
                    <IconButton color="primary" onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer la catégorie" arrow>
                    <IconButton color="secondary" onClick={() => handleDelete(category._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog d'ajout/édition de catégorie */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{currentCategory?._id ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Nombre d'articles"
            name="articleCount"
            type="number"
            value={formData.articleCount || 0}
            onChange={handleChange}
            fullWidth
          />

          {/* Sélection de la catégorie parente */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="parent-category-label">Catégorie parente</InputLabel>
            <Select
              labelId="parent-category-label"
              name="parentCategory"
              value={formData.parentCategory || ''}
              onChange={handleChange}
              label="Catégorie parente"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choisir une catégorie parente</FormHelperText>
          </FormControl>

          {/* Champ pour l'image */}
          <TextField
            margin="dense"
            label="URL de l'image"
            name="icon"
            value={formData.icon || ''}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isConfirmDialogOpen} onClose={handleCancelConfirm}>
        <DialogTitle>Confirmer l action</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette catégorie ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Protection de la page
export const getServerSideProps = withAuthorization(['admin', 'editor']);

export default AdminCategoryPage;
