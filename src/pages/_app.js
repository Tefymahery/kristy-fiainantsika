import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { UserProvider } from "../contexts/UserContext"; // Importer le UserProvider
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Vérifie si localStorage est disponible côté client
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedMode !== null) {
      setDarkMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Sauvegarde le mode dans localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2", // Couleur pour le mode clair et sombre
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e", // Une autre couleur
      },
    },
  });
  //console.log("Thème dans _app.js :", theme); // Vérifier si le thème est bien créé

  return (
    <UserProvider> {/* Envelopper l'application avec UserProvider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
