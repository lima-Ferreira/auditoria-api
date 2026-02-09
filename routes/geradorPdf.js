const express = require("express");
const router = express.Router();
const Auditoria = require("../models/Auditoria");
const { generateAuditPdf } = require("../utils/pdfGenerator"); // O arquivo novo que criamos
const fs = require("fs");
const path = require("path");

router.get("/:id", async (req, res) => {
  try {
    const auditoria = await Auditoria.findById(req.params.id).populate(
      "loja gerente auditor"
    );

    if (!auditoria)
      return res.status(404).json({ error: "Auditoria não encontrada" });

    // 1. Pega a logo (certifique-se que o caminho está certo)
    const logoPath = path.join(__dirname, "../utils/logo.bmp");
    const logoBase64 = fs.existsSync(logoPath)
      ? fs.readFileSync(logoPath).toString("base64")
      : "";

    // 2. Gera o PDF usando PDFMake (sem navegador!)
    const pdfDoc = generateAuditPdf(auditoria, logoBase64);

    // 3. Configura a resposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=auditoria_${req.params.id}.pdf`
    );

    // 4. Envia para o navegador
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("ERRO PDF NOVO:", error);
    res.status(500).json({ error: "Erro ao gerar PDF: " + error.message });
  }
});

module.exports = router;
