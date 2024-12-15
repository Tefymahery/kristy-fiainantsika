import mongoose from 'mongoose';
//mongoose.set('maxTimeMS', 5000); // Limite les requêtes MongoDB à 5 second

let isConnected = false; // Garder une trace de la connexion

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Déjà connecté à MongoDB");
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    console.log("Tentative de connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Timeout augmenté à 30 secondes
    });
    isConnected = true;
    console.log("Connexion à MongoDB réussie");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    throw new Error('Échec de la connexion à la base de données');
  }
};
