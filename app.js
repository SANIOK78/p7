// Installation et import d'EXPRESS permettant 
const express = require('express');
//import "morgan" logger des requetes "http"
const morgan = require("morgan");
// import d'analisuer de requ^te "body-parser"
const bodyParser = require('body-parser');
// import module conexion BD dans "app.js" qui gére l'APP
const mongoose = require('./connectDB/connectDB');
const path = require("path");

// les Routes:
const userRoute = require("./routes/userRoute");

// Création de l'APP
const app = express();
// app.use(express.json());

// Gérer les problemes des CORS (Cross-Origin Request Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods' , 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// "Body-parser" permet de transformer le corps (le body) en json, objetJS utilisable
app.use(bodyParser.json());

// logger les "req" et les "res" sur toutes les routes:
app.use(morgan("dev"));    //pendant le developpement

// Route pour  Authentification (inscription + connexion)  
app.use('/api/user', userRoute);

// chemin pour aller chercher les fichier static
app.use('/images', express.static(path.join(__dirname, 'images')));



// // La route du "profil user"
// app.use("/api/profil_user", profilUserRoute);


// app.use("/", (req, res) => {
//     res.json({message: "Salut client, votre requête est enregistré "});
    
// });

// exportation "app.js"
module.exports = app; 