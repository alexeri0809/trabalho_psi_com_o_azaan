const db = require('../db');

// Criar trabalho (professor)
exports.criarTrabalho = (req, res) => {
  const { titulo, descricao, prazo, alunos, criadoPor } = req.body;
  if (!titulo || !prazo || !alunos || alunos.length === 0) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  db.run(
    "INSERT INTO trabalhos (titulo, descricao, prazo, criadoPor) VALUES (?, ?, ?, ?)",
    [titulo, descricao, prazo, criadoPor],
    function(err) {
      if (err) return res.status(500).json(err);

      const trabalhoId = this.lastID;
      const stmt = db.prepare("INSERT INTO trabalho_destinatarios (trabalhoId, alunoId) VALUES (?, ?)");
      alunos.forEach(a => stmt.run(trabalhoId, a));
      stmt.finalize();

      res.json({ sucesso: true, trabalhoId });
    }
  );
};

// Listar trabalhos para professor
exports.listarTrabalhosProfessor = (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT t.*, GROUP_CONCAT(td.alunoId) AS alunos
     FROM trabalhos t
     LEFT JOIN trabalho_destinatarios td ON t.id = td.trabalhoId
     WHERE t.criadoPor = ?
     GROUP BY t.id`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};
// Listar entregas de um trabalho
exports.listarEntregasPorTrabalho = (req, res) => {
  const trabalhoId = req.params.trabalhoId;
  db.all("SELECT e.*, u.nome AS alunoNome FROM entregas e JOIN users u ON e.alunoId = u.id WHERE e.trabalhoId = ?", [trabalhoId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// Listar entregas de um trabalho por aluno específico
exports.listarEntregasPorTrabalhoAluno = (req, res) => {
  const trabalhoId = req.params.trabalhoId;
  const alunoId = req.params.alunoId;
  db.all("SELECT e.*, u.nome AS alunoNome FROM entregas e JOIN users u ON e.alunoId = u.id WHERE e.trabalhoId = ? AND e.alunoId = ?", [trabalhoId, alunoId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// Listar trabalhos para aluno
exports.listarTrabalhosAluno = (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT t.*
     FROM trabalhos t
     JOIN trabalho_destinatarios td ON t.id = td.trabalhoId
     WHERE td.alunoId = ?`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};

// Enviar entrega
exports.enviarEntrega = (req, res) => {
  const { trabalhoId, alunoId, ficheiro, descricao } = req.body;
  db.run(
    "INSERT INTO entregas (trabalhoId, alunoId, ficheiro, descricao) VALUES (?, ?, ?, ?)",
    [trabalhoId, alunoId, ficheiro, descricao],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ sucesso: true, entregaId: this.lastID });
    }
  );
};

// Avaliar entrega
exports.avaliarEntrega = (req, res) => {
  const { entregaId, nota, comentario } = req.body;
  db.run(
    "UPDATE entregas SET nota = ?, comentario = ?, status = 'avaliado' WHERE id = ?",
    [nota, comentario, entregaId],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ sucesso: true });
    }
  );
};
