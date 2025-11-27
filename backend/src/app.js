const express = require('express');
const cors = require('cors'); // <<< importar
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // <<< permitir requisições cross-origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Suas rotas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ... outras rotas

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
