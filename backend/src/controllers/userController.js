const db = require('../db');

// Signup
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

// Login
exports.login = (req, res) => {
  const { email, senha } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND senha = ?", [email, senha], (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });
    res.json({ user });
  });
};
