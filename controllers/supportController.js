const { saveSupportMessage } = require('../data/supportData');

async function handleSupportRequest(req, res) {
  try {
    const categoria = String(req.body?.categoria || '').trim().toLowerCase();
    const mensagem = String(req.body?.mensagem || '').trim();

    if (!categoria || !mensagem) {
      return res.status(400).json({
        success: false,
        error: "Os campos 'categoria' e 'mensagem' são obrigatórios."
      });
    }

    if (mensagem.length < 5) {
      return res.status(400).json({
        success: false,
        error: 'A mensagem é muito curta. Explique melhor o seu feedback.'
      });
    }

    if (mensagem.length > 1500) {
      return res.status(400).json({
        success: false,
        error: 'A mensagem deve ter no máximo 1500 caracteres.'
      });
    }

    await saveSupportMessage(categoria, mensagem);

    return res.status(200).json({
      success: true,
      message: 'Sua mensagem foi enviada com sucesso para a equipe da Zenkai!'
    });
  } catch (error) {
    console.error('Erro no supportController:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível salvar sua mensagem agora. Tente novamente mais tarde.'
    });
  }
}

module.exports = { handleSupportRequest };
