const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Novas rotas importantes
router.get('/', userController.listarUsuarios);
router.get('/alunos', userController.listarAlunos);
router.get('/professores', userController.listarProfs);

module.exports = router;
