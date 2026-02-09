const PDFDocument = require("pdfkit");

function generateAuditPdf(auditoria, res, logoBase64) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  // --- CABEÇALHO ---
  if (logoBase64) {
    try {
      const imgBuffer = Buffer.from(logoBase64, "base64");
      doc.image(imgBuffer, 40, 40, { width: 80 });
    } catch (e) {
      console.log("Erro na logo");
    }
  }

  // Dados da Loja (Lado direito da logo)
  doc
    .fillColor("#1e3a8a")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(auditoria.loja?.fantasia || "AUDITORIA", 130, 45);

  doc
    .fillColor("#666")
    .fontSize(9)
    .font("Helvetica")
    .text(`${auditoria.loja?.razao || ""}`, 130, 65)
    .text(`CNPJ: ${auditoria.loja?.cnpj || ""}`)
    .text(
      `${auditoria.loja?.endereco || ""} - ${auditoria.loja?.cidade || ""}`
    );

  // Linha azul grossa (Header border)
  doc.rect(40, 110, 515, 3).fill("#1e3a8a");
  doc.moveDown(4);

  // --- SEÇÃO: DADOS GERAIS ---
  renderSectionHeader(doc, "DADOS DA AUDITORIA", 130);
  doc
    .fillColor("#333")
    .fontSize(11)
    .font("Helvetica")
    .text(
      `Data: ${new Date(auditoria.data).toLocaleDateString("pt-BR")}`,
      50,
      155
    )
    .text(`Auditor: ${auditoria.auditor?.nome || "N/A"}`, 250, 155)
    .text(`Gerente: ${auditoria.gerente?.nome || "N/A"}`, 50, 170);

  // --- SEÇÃO: AVALIAÇÕES (GRID SIMULADO) ---
  renderSectionHeader(doc, "AVALIAÇÕES TÉCNICAS", 200);
  let yPos = 225;
  const avaliacoes = [
    { label: "ORG. LOJA", value: auditoria.organizacaoLoja },
    { label: "ORG. DEPÓSITO", value: auditoria.organizacaoDeposito },
    { label: "FARDAMENTOS", value: auditoria.fardamentos },
    { label: "VIG. SANITÁRIA", value: auditoria.vig_sanitaria },
    { label: "ALVARÁ", value: auditoria.alvara },
    { label: "BOMBEIROS", value: auditoria.bombeiros },
  ];

  avaliacoes.forEach((item, index) => {
    let x = index % 2 === 0 ? 50 : 300;
    doc.fontSize(9).fillColor("#64748b").text(item.label, x, yPos);
    doc
      .fontSize(11)
      .fillColor("#333")
      .text(item.value || "N/A", x, yPos + 12);
    if (index % 2 !== 0) yPos += 40;
  });

  // --- FINANCEIRO ---
  yPos += 20;
  renderSectionHeader(doc, "RESUMO FINANCEIRO", yPos);
  yPos += 25;
  doc
    .fontSize(12)
    .fillColor("#dc2626")
    .text(`TOTAL FALTAS: R$ ${auditoria.faltas}`, 50, yPos);
  doc
    .fillColor("#16a34a")
    .text(`TOTAL SOBRAS: R$ ${auditoria.sobras}`, 300, yPos);

  // Card de Resultado Final
  yPos += 30;
  doc.rect(40, yPos, 515, 50).fill("#1e3a8a");
  doc
    .fillColor("white")
    .fontSize(10)
    .text("RESULTADO FINAL", 40, yPos + 10, { align: "center" });
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(`R$ ${auditoria.resultadoFinal}`, 40, yPos + 22, { align: "center" });

  // --- CONCLUSÃO ---
  yPos += 70;
  renderSectionHeader(doc, "PARECER DO AUDITOR", yPos);
  doc
    .fontSize(11)
    .font("Helvetica-Oblique")
    .fillColor("#334155")
    .text(
      auditoria.conclusao || "Nenhuma observação registrada.",
      50,
      yPos + 30,
      { width: 500, align: "justify" }
    );

  // --- ASSINATURAS ---
  doc.font("Helvetica").fontSize(10).fillColor("#000");
  doc.moveTo(60, 750).lineTo(230, 750).stroke();
  doc.text("Assinatura do Auditor", 60, 755, { width: 170, align: "center" });

  doc.moveTo(350, 750).lineTo(520, 750).stroke();
  doc.text("Assinatura do Gerente", 350, 755, { width: 170, align: "center" });

  doc.end();
}

// Função auxiliar para desenhar o título das seções
function renderSectionHeader(doc, title, y) {
  doc.rect(40, y, 515, 18).fill("#f1f5f9");
  doc.rect(40, y, 5, 18).fill("#1e3a8a");
  doc
    .fillColor("#1e3a8a")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(title, 55, y + 5);
}

module.exports = { generateAuditPdf };
