// Importation de "modelUser.js" de la BD
const User = require("../models/userModel");
//verifications si les 'ID' sont reconnus par la BD
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');

exports.getAllUsers = async (req, res) => {

    // selectionne et renvoit tous, sauf le password 
    const users = await User.find();
    res.status(200).json(users);   
}

exports.getOneUser = (req, res) => {
    console.log(req.params)

    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnus : ' + req.params.id)
    }
    User.findById(req.params.id, (err, data) => {
        // si pas d'erreurs remontés
        if(!err) res.send(data);
        else console.log('ID unknown: ' + err);

    });  //ne retourne pas le mot de passe
}

// fonction permettant la mise a jour d'un utilisateur
exports.updateUser = (req, res, next) => {

    // 1.S'il ya un champs "file" dans notre objet requête:
    const imageObject = req.file ?
    {
       //On récupére l'objet en parsant la chaine de caractére
        ...JSON.parse(req.body.image),
      // et on recréer une nouvelle image
        photoProfilUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
      //S'il n'y a pas d' objet transmis, nous allons récupérer l'objet directement dans body
    } : {...req.body};

    //2. On va supprimer le "userId" venant de la requete pour éviter que quelqu'un créer un 
    // objet a son nom, puis le modifier pour le reasener a quelqu'un d'autre(par sécurité)
    delete imageObject._userId; 

    // 3.On va aller chercher cet objet dans la BD pour verifier si c'est bien l'user a qui
    // appartient cet objet qui cherche a la modifier:
    User.findOne({_id: req.params.id})

   //3.1 Cas de succes: on recuper l'objet et vérifier qu'il appartien bien a l'user qui nous
   //envoit la requete de modification
    .then((image) => {
        if (image.userId != req.auth.userId){
            res.status(401).json({message: "Non autorisé"});

        } else {
            User.updateOne({_id: req.params.id}, {...imageObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié'}))
            .catch(error => res.status(401).json({error}));
        }
    })

   //3.2 Cas d'erreur:
    .catch((error) => res.status(400).json({error}))
};

// fonction permettant la suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {

    // Recup dans la db
    User.findOne({_id: req.params.id })
    .then(info => {
        if (info.userId != req.auth.userId){
            res.status(401).json({message: "Non autorisé"});

        } else {
            // suppression de user dans la BD et son img das le systeme fichier
            // recup de image du system des fichiers pour le supprimer
            const filename = info.photoProfilUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                // suppresion de User dans la bD
                User.deleteOne({ _id : req.params.id})                  
                .then(() => res.status(200).json({message: "L'objet a été supprimé"}))
                .catch((error) => res.status(400).json({error}));
            })
        }
    })
    .catch(error => res.status(401).json({error}))

    // On Selection l'objet a supprimer grâce a son ID  
}

