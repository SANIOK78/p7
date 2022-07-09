//1. import "mongoose" pour interagir avec la BD
const mongoose = require('mongoose');
// 3.import module "mongoose-unique-validator" qui permet avoir une @mail unic
const uniqueValidator = require('mongoose-unique-validator')


// 2. Model de base pour "register" (enregistrement nouveau user)
const userSchema = mongoose.Schema({

    pseudo: {type: String, required: true},
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    imageProfilUrl: {type: String}
    },
    {  
        timestamps: true, 
    }
);

// 3.1 Application du validator a "userSchema": ce plugin permet d'éviter 
// d'avoir plusieurs users avec le même @mail
userSchema.plugin(uniqueValidator); 

// export du module
module.exports = mongoose.model("user", userSchema);
 
