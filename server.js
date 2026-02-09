require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Loja = require("./models/Loja");
const Gerente = require("./models/Gerente");
const Auditor = require("./models/Auditor");
const Auditoria = require("./models/Auditoria");

// ROTAS
const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors({ origin: "*" })); // Permite tudo temporariamente para testar
app.use(bodyParser.json());

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Erro MongoDB:", err);
    process.exit(1);
  });

/* ---------- ROTAS PDF ---------- */
app.use("/pdf", pdfRoutes);

/* ---------- LOJAS ---------- */
app.get("/api/lojas", async (req, res) => {
  res.json(await Loja.find().sort({ fantasia: 1 }));
});

app.post("/api/lojas", async (req, res) => {
  const doc = await Loja.create(req.body);
  res.status(201).json(doc);
});

/* ---------- GERENTES ---------- */
app.get("/api/gerentes", async (req, res) => {
  res.json(await Gerente.find().sort({ nome: 1 }));
});

app.post("/api/gerentes", async (req, res) => {
  const doc = await Gerente.create(req.body);
  res.status(201).json(doc);
});

/* ---------- AUDITORES ---------- */
app.get("/api/auditores", async (req, res) => {
  res.json(await Auditor.find().sort({ nome: 1 }));
});

app.post("/api/auditores", async (req, res) => {
  const doc = await Auditor.create(req.body);
  res.status(201).json(doc);
});

/* ---------- AUDITORIAS ---------- */
app.get("/api/auditorias", async (req, res) => {
  const docs = await Auditoria.find()
    .populate("loja", "fantasia")
    .populate("gerente", "nome")
    .populate("auditor", "nome")
    .sort({ data: -1 });

  res.json(docs);
});

app.get("/api/auditorias/:id", async (req, res) => {
  const doc = await Auditoria.findById(req.params.id)
    .populate("loja", "fantasia")
    .populate("gerente", "nome")
    .populate("auditor", "nome");

  if (!doc) return res.sendStatus(404);
  res.json(doc);
});

app.post("/api/auditorias", async (req, res) => {
  const doc = await Auditoria.create(req.body);
  res.status(201).json(doc);
});

app.delete("/api/auditorias/:id", async (req, res) => {
  await Auditoria.findByIdAndDelete(req.params.id);
  res.json({ message: "Excluído" });
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server rodando em http://localhost:${PORT}`)
);
