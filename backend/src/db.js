const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao abrir BD:', err.message);
  else console.log('SQLite: database.db pronto');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo TEXT NOT NULL
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS trabalhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    prazo TEXT,
    criadoPor INTEGER NOT NULL,
    criadoEm TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(criadoPor) REFERENCES users(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS trabalho_destinatarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trabalhoId INTEGER NOT NULL,
    alunoId INTEGER NOT NULL,
    FOREIGN KEY(trabalhoId) REFERENCES trabalhos(id),
    FOREIGN KEY(alunoId) REFERENCES users(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS entregas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trabalhoId INTEGER NOT NULL,
    alunoId INTEGER NOT NULL,
    ficheiro TEXT,
    descricao TEXT,
    dataEntrega TEXT DEFAULT CURRENT_TIMESTAMP,
    nota REAL,
    comentario TEXT,
    status TEXT DEFAULT 'pendente',
    FOREIGN KEY(trabalhoId) REFERENCES trabalhos(id),
    FOREIGN KEY(alunoId) REFERENCES users(id)
  );`);
});

module.exports = db;
