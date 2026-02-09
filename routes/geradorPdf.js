const express = require("express");
const router = express.Router();
const Auditoria = require("../models/Auditoria");
const { generateAuditPdf } = require("../utils/pdfGenerator");

router.get("/:id", async (req, res) => {
  try {
    const auditoria = await Auditoria.findById(req.params.id).populate(
      "loja gerente auditor"
    );
    if (!auditoria)
      return res.status(404).json({ error: "Auditoria não encontrada" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=auditoria.pdf`);

    // Passamos o 'res' para a função fazer o pipe
    generateAuditPdf(auditoria, res);
  } catch (error) {
    console.error("ERRO PDF:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
