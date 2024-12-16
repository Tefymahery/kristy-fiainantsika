import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export const withAuthorization = (allowedRoles) => async ({ req }) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!allowedRoles.includes(decoded.role)) {
      throw new Error('Not authorized');
    }

    return {
      props: {}, // Si l'utilisateur est autorisé
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/admin/',
        permanent: false,
      },
      props: {
        error: error.message, // Transmettre le message d'erreur à la page
      },
    };
  }
};
