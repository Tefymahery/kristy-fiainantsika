import { useRouter } from "next/router"; // Importer useRouter
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Crée le contexte
const UserContext = createContext();

// Fournisseur du contexte
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "", role: "" });
  const router = useRouter(); // Initialiser le router

  // Charger les informations de l'utilisateur depuis les cookies (si présent)
  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get("authToken");
      
      if (!token) {
        // Si aucun token, réinitialisez l'état utilisateur
        setUser({ name: "", role: "" });
        Cookies.remove("name");
        Cookies.remove("role");
        return;
      }

      try {
        const response = await fetch("/api/auth/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          // Token invalide ou expiré
          setUser({ name: "", role: "" });
          Cookies.remove("name");
          Cookies.remove("role");
          Cookies.remove("authToken");

          // Rediriger l'utilisateur vers la page de connexion
          router.push("/admin"); // Redirection vers la page de connexion
        }
      } catch (error) {
        console.error("Erreur lors de la validation du token:", error);
        setUser({ name: "", role: "" });
        Cookies.remove("name");
        Cookies.remove("role");
        Cookies.remove("authToken");

        // Rediriger l'utilisateur en cas d'erreur critique
        router.push("/admin");
      }
    };

    validateToken();
  }, []); // Ce useEffect est exécuté une seule fois lors du chargement du composant

  const login = (name, role) => {
    console.log("Login successful:", { name, role }); // Vérifiez que cette ligne s'exécute
    setUser({ name, role });
    Cookies.set("name", name);
    Cookies.set("role", role);
  };

  const logout = async () => {
    setUser({ name: "", role: "" });
    Cookies.remove("name");
    Cookies.remove("role");
    Cookies.remove("authToken");
  
    // Envoie une requête à l'API pour supprimer le cookie côté serveur
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Rediriger l'utilisateur vers la page d'accueil
    router.push("/");  // Redirection vers la page d'accueil
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour utiliser le contexte dans les composants
export const useUser = () => useContext(UserContext);
