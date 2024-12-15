import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (userId) => {
    setConfirmAction(() => async () => {
      try {
        await axios.delete(`/api/user?id=${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    });
    setIsConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentUser(null);
  };

  const handleSave = () => {
    setConfirmAction(() => async () => {
      try {
        if (currentUser._id) {
          await axios.put(`/api/user`, currentUser, { params: { id: currentUser._id } });
        } else {
          await axios.post('/api/user', currentUser);
        }
        fetchUsers();
        handleDialogClose();
      } catch (error) {
        console.error('Error saving user:', error);
      }
    });
    setIsConfirmDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await axios.put(`/api/user/${userId}/status`, { isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

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
        Gestion des utilisateurs
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleEdit({})}>
        Ajouter un utilisateur
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actif</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onChange={(e) => handleToggleActive(user._id, e.target.checked)}
                    disabled={user.role === 'admin'} // Désactive le Switch si l'utilisateur est un admin
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing user */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {currentUser?._id ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom"
            name="name"
            value={currentUser?.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentUser?.email || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Mot de passe"
            name="password"
            type="password"
            value={currentUser?.password || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Rôle"
            name="role"
            select
            value={currentUser?.role || 'guest'}
            onChange={handleChange}
            fullWidth
          >
            {['admin', 'moderator', 'editor', 'registered', 'guest'].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={handleCancelConfirm}>
        <DialogTitle>Confirmer l action</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir continuer ?</Typography>
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

export default AdminUserPage;
