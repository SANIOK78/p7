const jwt = require("jsonwebtoken");

// exportation de la fonction 
module.exports = (req, res, next) => {
    //Pour sécuriser et éviter de tous planter si jamais le Frontend envoit
    // une requête sans "token" on va utiliser try-catch
    try{

        // 1. Récuperation de "token" du frontend (dans headers 'authorisation': "bearer token")      
        const token = req.headers.authorization.split(" ")[1];
    
        // 2. Decodage(dechiffrement) du token récupéré. 
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET" );
        
        // 3. Récupération du "userID" déchiffré qu'il y a l'interieur du token: Ici il faudra comparer
        // si "userID" qu'y avait dans la requête du body est le même que celui récupéré depuis "token"     
        const userId = decodedToken.userId;
    
        //Objet "request" qui sera transmit aux routes qui vont être appelés par la suite
        req.auth = {userId: userId} 

        //4. Comparaison du "userId" qu'il y a en claire dans le "req.body" avec le "userId" du "token"
        if(req.body.userId && req.body.userId !== userId) {
            throw "User Id non valide";
    
        } else {
    
            next();
        }
  
      // S'il y a des erreurs dans "try" on les récupères dans "catch()"
    } catch(error) {
      res.status(401).json({
        message: "Requête non authorisé",
        error: error
      });
    }
};