const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "logo.bmp");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

function renderLoja(loja) {
  if (!loja || typeof loja !== "object") {
    return "—";
  }

  return `
    <strong>${loja.fantasia || ""}</strong><br/>
    Razão Social: ${loja.razao || ""}<br/>
    CNPJ: ${loja.cnpj || ""}<br/>
    Endereço: ${loja.endereco || ""} - ${loja.cidade || ""}<br/>
    Telefone: ${loja.telefone || ""}
  `;
}

function renderLista(titulo, lista) {
  if (!lista || !lista.length) return "";

  return `
    <div class="section">
      <strong>${titulo}</strong><br/>
      <ul>
        ${lista.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `;
}

function generateAuditHtml(auditoria) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 20px; }
  
  .header {
    display: grid;
    grid-template-columns: 150px 1fr 200px;
    align-items: center;
    border-bottom: 4px solid #1e3a8a; /* Azul escuro profissional */
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .header-center { text-align: center; font-size: 11px; color: #666; }
  .header-center .fantasia { font-size: 20px; color: #1e3a8a; font-weight: bold; text-transform: uppercase; }

  .section { margin-bottom: 25px; }
  .section-title { 
    background: #f1f5f9; 
    padding: 8px 12px; 
    font-weight: bold; 
    border-left: 5px solid #1e3a8a; 
    text-transform: uppercase; 
    font-size: 13px;
    margin-bottom: 10px;
  }

  .pdf-produtos-container {
    margin-top: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
}

.pdf-produto-item {
    font-size: 10.5px; /* Fonte pequena e técnica */
    color: #444;
    padding: 6px 0;
    border-bottom: 0.5px dashed #cbd5e1; /* Linha pontilhada bem fina */
    display: block;
    line-height: 1.4;
}

.pdf-produto-item:last-child {
    border-bottom: none;
}

.pdf-section-label {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: #1e3a8a;
    margin-bottom: 8px;
    display: block;
}


  /* Grid de Avaliações (Cards) */
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .item { padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 12px; }
  .label { font-weight: bold; color: #64748b; display: block; font-size: 10px; text-transform: uppercase; }

  /* Tabela de Resultados Financeiros */
  .result-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  .result-table td { padding: 12px; border: 1px solid #e2e8f0; }
  .val-sobra { color: #16a34a; font-weight: bold; }
  .val-falta { color: #dc2626; font-weight: bold; }
  
  .res-final { 
    background: #1e3a8a; color: white; text-align: center; 
    padding: 15px; border-radius: 8px; margin-top: 20px;
  }

  .signature-grid { 
    display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 60px; 
    text-align: center; font-size: 12px;
  }
  .sig-line { border-top: 1px solid #000; padding-top: 5px; }

  .conclusao-container {
    margin-top: 30px;
    page-break-inside: avoid; /* Evita que a conclusão quebre entre duas páginas */
}

.conclusao-header {
    background-color: #1e3a8a; /* Azul marinho profissional */
    color: white;
    padding: 8px 15px;
    font-size: 13px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 5px 5px 0 0;
    display: flex;
    align-items: center;
}

.conclusao-body {
    border: 1px solid #e2e8f0;
    border-top: none;
    padding: 20px;
    background-color: #f8fafc; /* Cinza bem claro para destacar do fundo */
    font-style: italic;
    font-size: 13px;
    line-height: 1.6;
    color: #334155;
    border-radius: 0 0 8px 8px;
    min-height: 100px;
}


  footer { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
</style>

</head>
<body>

<div class="header">

  <!-- ESQUERDA: LOGO -->
  <div class="header-left">
    <img
      src="data:image/bmp;base64,${logoBase64}"
      style="height:70px"
    />
  </div>

  <!-- CENTRO: DADOS DA LOJA -->
  <div class="header-center">
    <div class="fantasia">${auditoria.loja?.fantasia || ""}</div>
    ${auditoria.loja?.razao || ""}<br/>
    CNPJ: ${auditoria.loja?.cnpj || ""}<br/>
    ${auditoria.loja?.endereco || ""} - ${auditoria.loja?.cidade || ""}<br/>
    Tel: ${auditoria.loja?.telefone || ""}
  </div>

  <!-- DIREITA: CARD DE ACERTOS -->
  <div class="header-right">
    <div class="acerto-card">
      <div class="acerto-title">Núm dos Acertos</div>
      <div class="acerto-item">
        <strong>Saída:</strong> ${auditoria.acertoSaida}
      </div>
      <div class="acerto-item">
        <strong>Entrada:</strong> ${auditoria.acertoEntrada}
      </div>
    </div>
  </div>
</div>
<div style="font-size:12px; margin-bottom:15px;">
  <strong>Data da Auditoria:</strong>
  ${new Date(auditoria.data).toLocaleDateString("pt-BR")}
</div>
</div>

<div class="section">
  <div class="section-title">Auditor(s)</div>
  <div class="grid">
    <div class="item"><span class="label">Auditor(s):</span> ${auditoria.auditor?.nome}</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Gerência</div>
  <div class="grid">
    <div class="item"><span class="label">Gerente(a):</span> ${auditoria.gerente?.nome}</div>
  </div>
</div>


<div class="section">
  <div class="section-title">Avaliações</div>
  <div class="grid">
    <div class="item"><span class="label">Organização da Loja:</span> ${auditoria.organizacaoLoja}</div>
    <div class="item"><span class="label">Organização do Depósito:</span> ${auditoria.organizacaoDeposito}</div>
    <!--  <div class="item"><span class="label">Limpeza:</span> ${auditoria.limpeza}</div> -->
    <div class="item"><span class="label">Fardamentos:</span> ${auditoria.fardamentos}</div>
    <div class="item"><span class="label">Caixa 1:</span> ${auditoria.caixa_1}</div>
    <div class="item"><span class="label">Caixa 2:</span> ${auditoria.caixa_2}</div>
    <div class="item"><span class="label">Caixa 3:</span> ${auditoria.caixa_3}</div>
    <div class="item"><span class="label">Vig. Sanitária:</span> ${auditoria.vig_sanitaria}</div>
    <div class="item"><span class="label">Alvará:</span> ${auditoria.alvara}</div>
    <div class="item"><span class="label">Bombeiros:</span> ${auditoria.bombeiros}</div>
  </div>
</div>


${
  auditoria.produtosRelevantes && auditoria.produtosRelevantes.length > 0
    ? `
    <div class="section" style="page-break-inside: avoid;">
      <span class="pdf-section-label">📦 Itens com Divergência Detectada</span>
      <div class="pdf-produtos-container">
        ${auditoria.produtosRelevantes
          .map(
            (p) => `
          <div class="pdf-produto-item">
            • ${p}
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `
    : ""
}



<div class="section">
  <div class="section-title">Resumo Financeiro da Auditoria</div>
  <table class="result-table">
  <tr>
    <td><strong>Total de Faltas:</strong></td>
    <td class="val-falta">R$ ${auditoria.faltas}</td>
  </tr>
    <tr>
      <td><strong>Total de Sobras:</strong></td>
      <td class="val-sobra">R$ ${auditoria.sobras}</td>
    </tr>
  </table>
  
  <div class="res-final">
    <span style="font-size: 12px; opacity: 0.8;">RESULTADO FINAL</span><br/>
    <span style="font-size: 24px; font-weight: bold;">R$ ${auditoria.resultadoFinal}</span>
  </div>
</div>

 <div class="conclusao-container">
  <div class="conclusao-header">
    <span>📝 Parecer Final / Conclusão da Auditoria</span>
  </div>
  <div class="conclusao-body">
    ${auditoria.conclusao || "Nenhuma observação adicional registrada pelo auditor nesta inspeção."}
  </div>
</div>

<!-- Área de Assinaturas -->
<div class="signature-grid">
  <div>
    <div class="sig-line">Auditor: ${auditoria.auditor?.nome}</div>
  </div>
  <div>
    <div class="sig-line">Gerente da Loja: ${auditoria.gerente?.nome}</div>
  </div>
</div>

<footer>
  Relatório gerado automaticamente em ${new Date().toLocaleString("pt-BR")}
</footer>

</body>
</html>
`;
}

module.exports = { generateAuditHtml };
