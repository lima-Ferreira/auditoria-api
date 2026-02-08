require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const path = require("path");
const pdfRoutes = require("./routes/pdf");

const { sendMailWithBuffer } = require("./utils/mailer");
const { generateAuditHtml } = require("./utils/pdfTemplate");

const Loja = require("./models/Loja");
const Gerente = require("./models/Gerente");
const Auditor = require("./models/Auditor");
const Auditoria = require("./models/Auditoria");
const pdfRoutes = require("./routes/pdfRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/auditoria", pdfRoutes);
app.use("/pdf", pdfRoutes);

// Conexão MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/auditoriasdb";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => {
    console.error("Erro ao conectar MongoDB", err);
    process.exit(1);
  });

/* ----------------- Rotas CRUD simples ----------------- */

// LOJAS
app.get("/api/lojas", async (req, res) => {
  const data = await Loja.find().sort({ nome: 1 });
  res.json(data);
});
app.post("/api/lojas", async (req, res) => {
  const doc = new Loja(req.body);
  await doc.save();
  res.status(201).json(doc);
});
app.delete("/api/lojas/:id", async (req, res) => {
  await Loja.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// GERENTES
app.get("/api/gerentes", async (req, res) =>
  res.json(await Gerente.find().sort({ nome: 1 })),
);
app.post("/api/gerentes", async (req, res) => {
  const d = new Gerente(req.body);
  await d.save();
  res.status(201).json(d);
});
app.delete("/api/gerentes/:id", async (req, res) => {
  await Gerente.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// AUDITORES
app.get("/api/auditores", async (req, res) =>
  res.json(await Auditor.find().sort({ nome: 1 })),
);
app.post("/api/auditores", async (req, res) => {
  const d = new Auditor(req.body);
  await d.save();
  res.status(201).json(d);
});
app.delete("/api/auditores/:id", async (req, res) => {
  await Auditor.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// AUDITORIAS - CRUD
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
  if (!doc) return res.status(404).send("Não encontrado");
  res.json(doc);
});
app.post("/api/auditorias", async (req, res) => {
  const d = new Auditoria(req.body);
  await d.save();
  res.status(201).json(d);
});
app.put("/api/auditorias/:id", async (req, res) => {
  const doc = await Auditoria.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).send("Não encontrado");
  res.json(doc);
});
app.delete("/api/auditorias/:id", async (req, res) => {
  await Auditoria.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

/* ----------------- Gerar PDF sob demanda (não salva no servidor) -----------------
 Query options:
  - download=true  -> força download attachment
  - email=destino@exemplo.com -> envia por e-mail (usa SMTP do .env)
*/
app.get("/api/auditorias/:id/pdf", async (req, res) => {
  try {
    const id = req.params.id;

    const auditoria = await Auditoria.findById(id);
    if (!auditoria) return res.status(404).send("Auditoria não encontrada");

    // 🔥 BUSCAR LOJA COMPLETA (razao, fantasia, cnpj, endereço, telefone...)
    const loja = await Loja.findById(auditoria.loja);
    if (!loja) return res.status(404).send("Loja não encontrada");

    // 🔥 GERAR HTML COMPLETO COM CABEÇALHO, LOGO, TEXTO FINO ETC.
    const html = generateAuditHtml(auditoria, loja);

    // Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "12mm", right: "12mm" },
    });

    await browser.close();

    // 🔥 RETORNAR PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": `inline; filename="auditoria_${id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar PDF");
  }
});

/* ----------------- Start server ----------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
