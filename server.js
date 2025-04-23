const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Permitir requisições de qualquer origem
app.use(cors());

// Definir o formato de requisição como JSON
app.use(express.json());

// Dados de exemplo de contas (normalmente viria de um banco de dados)
let contas = [
  { id: 1, login: "usuario1", descricao: "Conta de exemplo", preco: 100 },
  { id: 2, login: "usuario2", descricao: "Conta de exemplo 2", preco: 200 },
];

// Rota para listar as contas
app.get('/api/contas', (req, res) => {
  res.json(contas);
});

// Rota para comprar uma conta
app.post('/api/comprar', (req, res) => {
  const { id } = req.body;

  // Buscar a conta pelo ID
  const conta = contas.find(c => c.id === id);

  if (conta) {
    // Remover a conta da lista de contas disponíveis
    contas = contas.filter(c => c.id !== id);
    return res.status(200).json({ success: true, message: 'Compra realizada com sucesso!', conta });
  } else {
    return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
  }
});

// Servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'build')));

// Rota para todas as outras requisições (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
