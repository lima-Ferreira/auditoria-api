const PDFDocument = require("pdfkit");

function generateAuditPdf(auditoria, res) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  // Conecta o PDF diretamente à resposta do Express
  doc.pipe(res);

  // CABEÇALHO
  doc
    .fontSize(20)
    .fillColor("#1e3a8a")
    .text("RELATÓRIO DE AUDITORIA", { align: "center" });
  doc.moveDown();

  // DADOS DA LOJA
  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Loja: ${auditoria.loja?.fantasia || "N/A"}`);
  doc.text(`Razão Social: ${auditoria.loja?.razao || "N/A"}`);
  doc.text(`Data: ${new Date(auditoria.data).toLocaleDateString("pt-BR")}`);
  doc.moveDown();

  // SEÇÃO AVALIAÇÕES
  doc.fontSize(14).fillColor("#1e3a8a").text("AVALIAÇÕES", { underline: true });
  doc.fontSize(11).fillColor("black");
  doc.text(`Organização Loja: ${auditoria.organizacaoLoja || "—"}`);
  doc.text(`Organização Depósito: ${auditoria.organizacaoDeposito || "—"}`);
  doc.text(`Fardamentos: ${auditoria.fardamentos || "—"}`);
  doc.moveDown();

  // FINANCEIRO
  doc.fontSize(14).fillColor("#1e3a8a").text("RESUMO FINANCEIRO");
  doc
    .fontSize(11)
    .fillColor("red")
    .text(`Faltas: R$ ${auditoria.faltas || 0}`);
  doc.fillColor("green").text(`Sobras: R$ ${auditoria.sobras || 0}`);
  doc.moveDown();
  doc
    .fontSize(16)
    .fillColor("#1e3a8a")
    .text(`RESULTADO FINAL: R$ ${auditoria.resultadoFinal || 0}`, {
      bold: true,
    });

  // FINALIZA
  doc.end();
}

module.exports = { generateAuditPdf };
