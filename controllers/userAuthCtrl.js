//import module "bcrypt" pour hasher les mot de pass
const bcrypt = require("bcrypt");
//import de " JSON web Token": créer et verifier les token
const jwt = require("jsonwebtoken");
// Importation de "modelUser.js" de la BD
const User = require("../models/userModel");

// fonction permettant l'inscription
exports.signUp = (req, res) => {
    
    // 2.Hacher le mot de passe avant de l'envoyer BD,
    //executer l'alghorithme de hashage 10 fois pour 
    // ajouter un "sel" plus complex
    bcrypt.hash(req.body.password, 10)   
    .then((hash) => {
        const user = new User({
            pseudo: req.body.pseudo,
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: hash
        })
        // console.log(user);
        // 4. Enregistrement de "user" dans la BD
        user.save()                                      
        .then(() => res.status(201).json({
            message: "Utilisateur créé ",
            userId: user._id,
            pseudo : user.pseudo
        }))  
        .catch((error) => res.status(400).json({error}));
    })
    .catch((error) =>  res.status(500).json({error}));  
};


// la Connexion a l'APP 
exports.signIn = (req, res) => {
    // On va verifier si l'User existe dans notre BD et si le mot de passe transmit
    // par le Frontend correspond a cet User:

    //1. Recup user en filtrant par son @mail depuis body
    User.findOne({email: req.body.email})  //"req.body.email" => transmit par Frontend
    //2. verif si user trouvé
    .then((user) => {
        // Si user(.mail) pas enregisté dans BD
        if(user === null) {
            return res.status(401).json({message: "Paire identifiant/mot de passe incorrect "});
        }

        //Si user trouvé: contrôler la validité du password envoyé par le front
        bcrypt.compare(req.body.password, user.password)  //frontend et BD 
        .then(valid => {    //récup d'un boolean voir si le test est bon ou pas
            // si mot de passe ne corresponde pas
            if(!valid) {
                return res.status(401).json({message: 'Paire identifiant/mot de passe incorrect '})
            }

            // Envoie dans la response du Serveur du "userID" et du token d'authentification 
            return res.status(200).json({
                userId: user._id,
                token: jwt.sign(     //prend 3 argument les données à encoder
                    {userId: user._id},
                    "RANDOM_TOKEN_SECRET",  // clé secret pour encodaje
                    { expiresIn: '24h'}   //argument de config: token expire en 24h
                )
            });
        })
        .catch(error => res.status(500).json({error}));   
    })
    .catch((error) => res.status(500).json({error}));   
};

// fonction permattant la deconnexion
exports.logOut = (req, res) => {
    // // on retire les cookies
    // res.cookie('jwt', '', {maxAge: 1}); 
    // res.status(200).json({message: "Client déconnecté !"})   
    res.redirect('/');
}