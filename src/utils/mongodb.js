import mongoose from 'mongoose';

let isConnected = false; // Garder une trace de la connexion

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connexion à MongoDB réussie");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    throw new Error('Échec de la connexion à la base de données');
  }
};
