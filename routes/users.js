const router = require("express").Router();
const users = require('../controllers/users.controller');
const middlewares = require('../middlewares');

// Bisa diakses oleh semua orang
router.post('/login', users.login);
router.post('/logingoogle', users.loginGoogle);
router.post('/register', users.register);
router.get('/me', middlewares.verifyToken, users.getCurrentUser);
router.put('/:id', middlewares.verifyToken, users.updateUser);
router.delete('/me', middlewares.verifyToken, users.deleteMe);

// Hanya bisa diakses oleh superadmin
router.post('/registeradmin', middlewares.verifyToken, middlewares.verifySuperAdmin, users.registerAdmin);

// Hanya bisa diakses oleh admin dan superadmin
router.get('/', middlewares.verifyToken, middlewares.verifyAdmin, users.getAllUsers);
router.get('/:id', middlewares.verifyToken, middlewares.verifyAdmin, users.getUserById);
router.delete('/:id', middlewares.verifyToken, middlewares.verifyAdmin, users.deleteUser);

module.exports = router;