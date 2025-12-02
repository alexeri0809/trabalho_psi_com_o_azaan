const express = require('express');
const router = express.Router();
const trabalhoController = require('../controllers/trabalhoController');

router.post('/', trabalhoController.criarTrabalho);
router.get('/professor/:id', trabalhoController.listarTrabalhosProfessor);
router.get('/aluno/:id', trabalhoController.listarTrabalhosAluno);
router.post('/entregar', trabalhoController.enviarEntrega);
router.put('/avaliar', trabalhoController.avaliarEntrega);
// listar entregas de um trabalho
router.get('/entregas/trabalho/:trabalhoId', trabalhoController.listarEntregasPorTrabalho);
// listar entregas de um trabalho por aluno
router.get('/entregas/trabalho/:trabalhoId/aluno/:alunoId', trabalhoController.listarEntregasPorTrabalhoAluno);

module.exports = router;
