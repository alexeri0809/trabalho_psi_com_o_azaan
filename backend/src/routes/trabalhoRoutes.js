const express = require('express');
const router = express.Router();
const trabalhoController = require('../controllers/trabalhoController');

router.post('/', trabalhoController.criarTrabalho);
router.get('/professor/:id', trabalhoController.listarTrabalhosProfessor);
router.get('/aluno/:id', trabalhoController.listarTrabalhosAluno);
router.post('/entregar', trabalhoController.enviarEntrega);
router.put('/avaliar', trabalhoController.avaliarEntrega);

module.exports = router;
