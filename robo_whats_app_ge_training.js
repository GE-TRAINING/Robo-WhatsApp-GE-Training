// ===============================
// ROBÔ PROFISSIONAL WHATSAPP
// GE Training Informática
// Node.js + WhatsApp Cloud API
// ===============================

// -------- CONFIGURAÇÃO --------
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 👉 PREENCHA COM SEUS DADOS DA META
const TOKEN = 'SEU_TOKEN_AQUI';
const PHONE_NUMBER_ID = 'SEU_PHONE_NUMBER_ID';

// -------- VERIFICAÇÃO DO WEBHOOK --------
app.get('/webhook', (req, res) => {
  const verify_token = 'ge_training';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      return res.status(200).send(challenge);
    }
  }
  res.sendStatus(403);
});

// -------- RECEBER MENSAGENS --------
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const telefone = message.from;
    const texto = message.text?.body?.toLowerCase();

    let resposta = menuPrincipal();

    if (texto === '1') resposta = cursos();
    if (texto === '2') resposta = matricula();
    if (texto === '3') resposta = endereco();
    if (texto === '4') resposta = atendente();

    await enviarMensagem(telefone, resposta);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// -------- FUNÇÕES DE RESPOSTA --------
function menuPrincipal() {
  return (
    '👋 Olá! Seja bem-vindo à *GE Training Informática* 💻\n\n' +
    'Digite uma opção:\n' +
    '1️⃣ Cursos\n' +
    '2️⃣ Matrícula\n' +
    '3️⃣ Endereço\n' +
    '4️⃣ Falar com atendente'
  );
}

function cursos() {
  return (
    '📚 *Cursos Disponíveis*\n\n' +
    '✔ Informática Completa\n' +
    '✔ Informática Avançada\n' +
    '✔ Cursos Profissionalizantes\n\n' +
    'Digite *2* para matrícula.'
  );
}

function matricula() {
  return (
    '📝 *MATRÍCULA PROMOCIONAL*\n\n' +
    '💰 Matrícula com desconto especial\n' +
    '📆 Início imediato\n\n' +
    '📞 Contato: 82 9 9375-0221'
  );
}

function endereco() {
  return (
    '📍 *Endereço*\n\n' +
    'Rua Dr. Júlio de Mendonça, 295\n' +
    'Esquina da Subida do Alto\n' +
    'São Luís do Quitunde - AL'
  );
}

function atendente() {
  return '👨‍💼 Um atendente falará com você em instantes.';
}

// -------- ENVIO DE MENSAGEM --------
async function enviarMensagem(para, texto) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: para,
      text: { body: texto }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

// -------- INICIAR SERVIDOR --------
app.listen(3000, () => {
  console.log('🤖 Robô WhatsApp GE Training rodando na porta 3000');
});
