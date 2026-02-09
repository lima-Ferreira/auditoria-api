const express = require("express");
const router = express.Router();
const Auditoria = require("../models/Auditoria");
const { generateAuditHtml } = require("../utils/pdfTemplate");
const puppeteer = require("puppeteer"); // Trocamos para puppeteer

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const auditoria = await Auditoria.findById(id)
      .populate("loja")
      .populate("gerente")
      .populate("auditor");

    if (!auditoria) {
      return res.status(404).json({ error: "Auditoria não encontrada" });
    }

    const html = generateAuditHtml(auditoria);

    // Configuração específica para rodar no RENDER
    // Configuração para rodar no RENDER (Dinâmica)
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      // Remova a linha do executablePath ou deixe como está abaixo:
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    // No puppeteer usamos 'networkidle0' para garantir que carregou tudo
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=auditoria_${id}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("ERRO PDF:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
