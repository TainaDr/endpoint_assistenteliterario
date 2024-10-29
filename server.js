const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(requestIp.mw());

mongoose.connect(
      "mongodb+srv://seu_usuario:senha@cluster0.mongodb.net/cluster",
      {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      }
);

const historySchema = new mongoose.Schema({
      userId: String,
      action: String,
      ipAddress: String,
      city: String,
      state: String,
      country: String,
      timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

app.get("/api/test-connection", (req, res) => res.send("Conexão bem-sucedida"));

app.post("/api/history", async (req, res) => {
      const { userId, action, city, state, country } = req.body;
      const ipAddress = req.clientIp;

      const newHistory = new History({
            userId,
            action,
            ipAddress,
            city,
            state,
            country,
      });
      try {
            await newHistory.save();
            res.status(201).send("Histórico registrado com sucesso!");
      } catch (error) {
            console.error("Erro ao registrar histórico:", error);
            res.status(500).send("Erro ao registrar histórico.");
      }
});

app.listen(port, () =>
      console.log(`Servidor rodando em http://localhost:${port}`)
);
