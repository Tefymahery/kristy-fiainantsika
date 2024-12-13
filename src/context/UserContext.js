import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Assurez-vous d'installer cette bibliothèque : npm install jwt-decode
import { useRouter } from 'next/router'; // Pour effectuer la redirection

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement pour gérer la vérification du token
  const router = useRouter(); // Utilisation du router pour les redirections

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token dans LocalStorage :', token);
  
    // Vérifier si on est sur une page protégée
    if (router.pathname.startsWith('/admin')) {
      if (token && !isTokenExpired(token)) {
        const decodedUser = decodeToken(token);
        console.log('Utilisateur récupéré du token :', decodedUser);
        setUser(decodedUser);
      } else {
        if (token) {
          console.log('Token expiré. Déconnexion...');
          localStorage.removeItem('token');
        }
        setUser(null);
        router.push('/admin'); // Rediriger vers la page de connexion
      }
    }
  
    setLoading(false);  // Terminer le chargement ici après avoir vérifié l'état de l'utilisateur
  }, [router.pathname]); // On ne veut exécuter ce `useEffect` que quand le chemin change
  
  
  

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = decodeToken(token); // Décodez le token pour extraire l'utilisateur
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/admin'); // Redirige vers la page de connexion lors de la déconnexion
  };

  const decodeToken = (token) => {
    try {
      return jwtDecode(token); // Utilise jwt-decode pour décoder le JWT
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
      return null; // Retournez null si le token ne peut pas être décodé
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return true; // Le token est expiré
      }
      return false; // Le token est valide
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token :', error);
      return true; // Considérez le token comme expiré en cas d'erreur
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
