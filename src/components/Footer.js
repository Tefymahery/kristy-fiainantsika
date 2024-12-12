import React from "react";
import { Box, Container, Grid, Typography, IconButton, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from "@mui/icons-material";

const Footer = () => {
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
          {/* Section des liens de navigation */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Liens
            </Typography>
            <Box>
              <Link href="#" color="inherit" display="block" sx={{ marginBottom: "0.5rem" }}>
                À propos
              </Link>
              <Link href="#" color="inherit" display="block" sx={{ marginBottom: "0.5rem" }}>
                Articles
              </Link>
              <Link href="#" color="inherit" display="block" sx={{ marginBottom: "0.5rem" }}>
                Contact
              </Link>
              <Link href="#" color="inherit" display="block" sx={{ marginBottom: "0.5rem" }}>
                Politique de confidentialité
              </Link>
            </Box>
          </Grid>

          {/* Section des réseaux sociaux */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Suivez-nous
            </Typography>
            <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="GitHub">
                <GitHub />
              </IconButton>
            </Box>
          </Grid>

          {/* Section du copyright */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ textAlign: "center", marginTop: "1rem" }}>
              &copy; {new Date().getFullYear()} VotreSite. Tous droits réservés.
            </Typography>
          </Grid>

          {/* Bouton de retour en haut */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <Link href="#" color="inherit" display="block" sx={{ fontSize: "1.2rem" }}>
                Retour en haut
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;