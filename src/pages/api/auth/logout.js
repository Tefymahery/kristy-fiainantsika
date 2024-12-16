import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Supprimer les cookies authToken, name, et role
    res.setHeader(
      'Set-Cookie',
      [
        serialize('authToken', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 0, // Expiration immédiate
        }),
        serialize('name', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 0, // Expiration immédiate
        }),
        serialize('role', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 0, // Expiration immédiate
        })
      ]
    );

    res.status(200).json({ msg: 'Logged out successfully' });
  } else {
    res.status(405).json({ msg: 'Method Not Allowed' });
  }
}
