const { generateAuditPdf } = require("../utils/pdfGenerator");
const fs = require("fs");
const path = require("path");

router.get("/:id", async (req, res) => {
  try {
    const auditoria = await Auditoria.findById(req.params.id).populate(
      "loja gerente auditor"
    );
    if (!auditoria) return res.status(404).send("Auditoria não encontrada");

    // Lê a logo
    const logoPath = path.join(__dirname, "../utils/logo.bmp");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");

    const pdfDoc = generateAuditPdf(auditoria, logoBase64);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=auditoria.pdf`);

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
});
