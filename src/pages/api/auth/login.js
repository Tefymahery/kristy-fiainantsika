import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../backend/models/User';
import { connectToDatabase } from '../../../utils/mongodb';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Connexion à MongoDB
      await connectToDatabase();

      // Trouver l'utilisateur par email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Expiration en 1 heure
      );

      // Ajouter le token, le nom et le rôle dans des cookies sécurisés
      res.setHeader('Set-Cookie', [
        serialize('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60, // Expire dans 1 heure
        }),
        serialize('name', user.name, {
          httpOnly: false, // Pas besoin de `httpOnly` pour les informations accessibles côté client
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60, // Expire dans 1 heure
        }),
        serialize('role', user.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60, // Expire dans 1 heure
        })
      ]);

      // Répondre avec les informations utilisateur (sans le token)
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  } else {
    res.status(405).json({ msg: 'Method Not Allowed' });
  }
}
