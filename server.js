require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supportRoutes = require('./routes/supportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Sem ALLOWED_ORIGINS a API continua acessível para facilitar o primeiro deploy.
// Em produção, informe os domínios do site separados por vírgula.
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não autorizada pelo CORS.'));
  },
  methods: ['POST', 'GET', 'OPTIONS']
}));
app.use(express.json({ limit: '16kb' }));

app.get('/api/status', (req, res) => {
  res.json({ success: true, status: 'API de suporte da Zenkai está online.' });
});

app.use('/api', supportRoutes);

// A Vercel carrega o Express como uma Function. O listen é usado apenas localmente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Rota de suporte: http://localhost:${PORT}/api/support`);
  });
}

module.exports = app;
