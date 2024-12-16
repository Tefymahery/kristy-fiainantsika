import React from "react";
import { Box, Container, Grid, Typography, Button, Link } from "@mui/material";
import { useUser } from "../contexts/UserContext"; // Importer le contexte

const Footer = () => {
  const { user, logout } = useUser(); // Utilise le contexte pour accéder aux données de l'utilisateur
  console.log(user);  // Vérifiez que l'utilisateur est bien mis à jour ici

  const handleLogout = async () => {
    // Effectuer la déconnexion
    await logout(); // Cela supprime aussi les cookies côté client
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        padding: "2rem 0",
        marginTop: "2rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Section du compte */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Compte
            </Typography>
            <Box sx={{ marginTop: "1rem" }}>
              {user.name ? (
                <>
                  <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
                    Nom : <strong>{user.name}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                    Rôle : <strong>{user.role}</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                    sx={{ textTransform: "none" }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link href="/admin" color="inherit" sx={{ textDecoration: "none" }}>
                  Se connecter
                </Link>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
