const db = require('../db');

// ============================
// SIGNUP
// ============================
exports.signup = (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json(err);
    if (user) return res.status(400).json({ error: "Email já registrado" });

    db.run(
      "INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senha, tipo],
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ user: { id: this.lastID, nome, email, tipo } });
      }
    );
  });
};

// ============================
// LOGIN
// ============================
exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ? AND senha = ?",
    [email, senha],
    (err, user) => {
      if (err) return res.status(500).json(err);
      if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

      res.json({ user });
    }
  );
};

// ============================
// LISTAR TODOS OS USUÁRIOS
// ============================
exports.listarUsuarios = (req, res) => {
  db.all("SELECT id, nome, email, tipo FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar usuários" });
    res.json(rows);
  });
};

// ============================
// LISTAR ALUNOS
// ============================
exports.listarAlunos = (req, res) => {
  db.all("SELECT id, nome, email FROM users WHERE tipo = 'aluno'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar alunos" });
    res.json(rows);
  });
};

// ============================
// LISTAR PROFESSORES
// ============================
exports.listarProfs = (req, res) => {
  db.all("SELECT id, nome, email FROM users WHERE tipo = 'professor'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar professores" });
    res.json(rows);
  });
};
