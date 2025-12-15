const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const mensagem = req.body.entry[0].changes[0].value.messages?.[0]?.text?.body;
  const telefone = req.body.entry[0].changes[0].value.messages?.[0]?.from;

  if (!mensagem) return res.sendStatus(200);

  let resposta = "Olá! Seja bem-vindo à GE Training Informática 💻\n\n" +
    "1️⃣ Cursos\n2️⃣ Matrícula\n3️⃣ Endereço\n4️⃣ Falar com atendente";

  enviarMensagem(telefone, resposta);
  res.sendStatus(200);
});

function enviarMensagem(para, texto) {
  axios.post(
    "https://graph.facebook.com/v19.0/SEU_PHONE_ID/messages",
    {
      messaging_product: "whatsapp",
      to: para,
      text: { body: texto }
    },
    {
      headers: {
        Authorization: "Bearer SEU_TOKEN",
        "Content-Type": "application/json"
      }
    }
  );
}

app.listen(3000, () => console.log("Robô rodando na porta 3000"));
