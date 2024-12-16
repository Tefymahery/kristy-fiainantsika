import React from "react";
import Login from "@/components/admin/Login";

export default function AdminHomePage() {
  // Si l'utilisateur n'est pas redirigé par `getServerSideProps`,
  // il verra la page de connexion
  return (
    <div>
      <Login />
    </div>
  );
}

// Fonction getServerSideProps pour gérer l'authentification
export async function getServerSideProps({ req }) {
  const { parse } = await import('cookie'); // Import de parse pour lire les cookies
  const jwt = await import('jsonwebtoken'); // Import de jwt pour vérifier le token

  try {
    // Lire les cookies de la requête
    const cookies = parse(req.headers.cookie || '');

    // Vérifier si le cookie authToken existe
    if (!cookies.authToken) {
      // Pas de token, rester sur la page de connexion
      return { props: {} };
    }

    // Décoder et vérifier le token JWT
    const decoded = jwt.verify(cookies.authToken, process.env.JWT_SECRET);

    // Si le token est valide, rediriger vers le tableau de bord
    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
    };
  } catch (error) {
    // Si le token est invalide ou absent, rester sur la page de connexion
    return { props: {} };
  }
}
