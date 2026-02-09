const PdfPrinter = require("pdfmake");

const fonts = {
  Roboto: {
    normal: "https://cdnjs.cloudflare.com",
    bold: "https://cdnjs.cloudflare.com",
  },
};

const printer = new PdfPrinter(fonts);

function generateAuditPdf(auditoria, logoBase64) {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    content: [
      // HEADER (Colunas: Logo | Dados Loja | Acertos)
      {
        columns: [
          {
            image: `data:image/bmp;base64,${logoBase64}`,
            width: 80,
          },
          {
            stack: [
              { text: auditoria.loja?.fantasia || "", style: "fantasia" },
              { text: auditoria.loja?.razao || "", fontSize: 9 },
              { text: `CNPJ: ${auditoria.loja?.cnpj || ""}`, fontSize: 9 },
              {
                text: `${auditoria.loja?.endereco || ""} - ${
                  auditoria.loja?.cidade || ""
                }`,
                fontSize: 9,
              },
            ],
            alignment: "center",
          },
          {
            stack: [
              {
                text: "NÚM DOS ACERTOS",
                fontSize: 10,
                bold: true,
                color: "#1e3a8a",
              },
              { text: `Saída: ${auditoria.acertoSaida || 0}`, fontSize: 10 },
              {
                text: `Entrada: ${auditoria.acertoEntrada || 0}`,
                fontSize: 10,
              },
            ],
            alignment: "right",
          },
        ],
        columnGap: 10,
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 10,
            x2: 515,
            y2: 10,
            lineWidth: 2,
            lineColor: "#1e3a8a",
          },
        ],
      },
      {
        text: `Data da Auditoria: ${new Date(auditoria.data).toLocaleDateString(
          "pt-BR"
        )}`,
        margin: [0, 15, 0, 15],
        fontSize: 10,
      },

      // SEÇÃO: AVALIAÇÕES (GRID)
      { text: "AVALIAÇÕES", style: "sectionTitle" },
      {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              {
                stack: [
                  { text: "ORG. LOJA", style: "label" },
                  { text: auditoria.organizacaoLoja },
                ],
              },
              {
                stack: [
                  { text: "ORG. DEPÓSITO", style: "label" },
                  { text: auditoria.organizacaoDeposito },
                ],
              },
              {
                stack: [
                  { text: "FARDAMENTOS", style: "label" },
                  { text: auditoria.fardamentos },
                ],
              },
            ],
            [
              {
                stack: [
                  { text: "CAIXA 1", style: "label" },
                  { text: auditoria.caixa_1 },
                ],
              },
              {
                stack: [
                  { text: "CAIXA 2", style: "label" },
                  { text: auditoria.caixa_2 },
                ],
              },
              {
                stack: [
                  { text: "CAIXA 3", style: "label" },
                  { text: auditoria.caixa_3 },
                ],
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },

      // PRODUTOS RELEVANTES
      auditoria.produtosRelevantes?.length > 0
        ? [
            {
              text: "📦 ITENS COM DIVERGÊNCIA DETECTADA",
              style: "sectionTitle",
              margin: [0, 20, 0, 5],
            },
            {
              ul: auditoria.produtosRelevantes,
              fontSize: 9,
              color: "#444",
            },
          ]
        : "",

      // FINANCEIRO
      {
        text: "RESUMO FINANCEIRO",
        style: "sectionTitle",
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              { text: "Total de Faltas:", bold: true },
              { text: `R$ ${auditoria.faltas}`, color: "red", bold: true },
            ],
            [
              { text: "Total de Sobras:", bold: true },
              { text: `R$ ${auditoria.sobras}`, color: "green", bold: true },
            ],
          ],
        },
      },
      {
        fillColor: "#1e3a8a",
        margin: [0, 10, 0, 0],
        stack: [
          {
            text: "RESULTADO FINAL",
            color: "white",
            alignment: "center",
            fontSize: 10,
          },
          {
            text: `R$ ${auditoria.resultadoFinal}`,
            color: "white",
            alignment: "center",
            fontSize: 20,
            bold: true,
          },
        ],
        padding: [10, 10, 10, 10],
      },

      // CONCLUSÃO
      {
        text: "PARECER FINAL / CONCLUSÃO",
        style: "sectionTitle",
        margin: [0, 20, 0, 5],
      },
      {
        text: auditoria.conclusao || "Nenhuma observação registrada.",
        italics: true,
        fontSize: 11,
        background: "#f8fafc",
        margin: [0, 0, 0, 20],
      },

      // ASSINATURAS
      {
        margin: [0, 50, 0, 0],
        columns: [
          {
            stack: [
              {
                canvas: [
                  { type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 },
                ],
              },
              {
                text: `Auditor: ${auditoria.auditor?.nome || ""}`,
                fontSize: 10,
              },
            ],
            alignment: "center",
          },
          {
            stack: [
              {
                canvas: [
                  { type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 },
                ],
              },
              {
                text: `Gerente: ${auditoria.gerente?.nome || ""}`,
                fontSize: 10,
              },
            ],
            alignment: "center",
          },
        ],
      },
    ],
    styles: {
      fantasia: { fontSize: 16, bold: true, color: "#1e3a8a" },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: "#1e3a8a",
        background: "#f1f5f9",
        margin: [0, 10, 0, 5],
      },
      label: { fontSize: 8, color: "#64748b", bold: true },
    },
  };

  return printer.createPdfKitDocument(docDefinition);
}

module.exports = { generateAuditPdf };
