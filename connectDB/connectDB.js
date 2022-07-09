//import "dotenv" permettant l'utilisation devariablenvironement
require('dotenv').config();

// Connexion a la base de données MongoDb Atlass :
// On a besoin d'installer et importer "mongoose" qui
// permet l'interaction avec la BD
const mongoose = require("mongoose");

// connexion a MongoBd
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// export 'mongoose'
module.exports = mongoose;



