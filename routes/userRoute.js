// importation express permettant d'utiliser express.Router()
const express = require('express');
// Utilisation fonction Routeur()
const router = express.Router();
const auth = require("../middlewars/auth");
const multer = require("../middlewars/multer-config");
//import controller associé au User
const userAuthCtrl = require("../controllers/userAuthCtrl");
const userCtrl = require("../controllers/userCtrl");

// Route permettant l'inscription d'un User
router.post("/register", userAuthCtrl.signUp );
// Route permettant la connexion
router.post("/login", userAuthCtrl.signIn);
// Route permettant la deconexion
router.get('/logout', userAuthCtrl.logOut);

// Route permettant d'afficher tous le users
router.get('/', auth, userCtrl.getAllUsers);

// Route permettant d'afficher un seul users
router.get('/:id', auth, userCtrl.getOneUser);

// rout permettant la mise a jour du user
router.put('/:id', auth, multer, userCtrl.updateUser);

// route permettant la suppression d'un user
router.delete('/:id', auth, userCtrl.deleteUser);



module.exports = router;