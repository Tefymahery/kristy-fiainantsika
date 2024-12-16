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
    const userName = Cookies.get("name");
    const userRole = Cookies.get("role");

    if (userName && userRole) {
      console.log("Cookies read:", { userName, userRole });
      setUser({ name: userName, role: userRole });
    } else {
      setUser({ name: "", role: "" });  // Assurez-vous de réinitialiser l'état si les cookies sont vides
    }
  }, []);

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
