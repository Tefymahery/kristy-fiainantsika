import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../backend/models/User';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Se connecter à la base de données MongoDB
      await connectToDatabase();

      // Trouver l'utilisateur par email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }

      // Comparer le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Réponse avec le token et les informations utilisateur
      res.status(200).json({
        token,
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
    // Si la méthode HTTP n'est pas POST, on renvoie une erreur 405 (Method Not Allowed)
    res.status(405).json({ msg: 'Method Not Allowed' });
  }
}
