// Multer = gérer les requêtes HTTP avec envoie des fichiers
const multer = require('multer');

// dictionnaire MIME_TYPE du fichier
const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpg",
    "image/gif" : "gif",
    "image/png" : "png",
};

// 1.Destination: stokage du fichier envoyé par le Fronend et
// générer un nom unique
const storage = multer.diskStorage({

    // la destination de stockage du fichier
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        // supprimer les espaces dans le nom du fichier
        const name = file.originalname.split(" ").join("_");
        // rajout d'extentions fichier
        const extension = MIME_TYPES[file.mimetype];

        // Création du fichier complet
        callback(null, name + Date.now() + "." + extension);        
    }
});
// Date.now() = Nb de miliseconde qui se sont passe depuis 1970

module.exports = multer({storage}).single("image");