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
  console.log(auditoria);
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>
.header {
  display: grid;
  grid-template-columns: 120px 1fr 200px;
  align-items: center;
  border-bottom: 3px solid #000;
  padding-bottom: 12px;
  margin-bottom: 10px;
}

.header-left {
  text-align: left;
}

.header-center {
  text-align: center;
  line-height: 1.4;
}

.header-center .fantasia {
  font-size: 16px;
  font-weight: bold;
}

.header-right {
  display: flex;
  justify-content: flex-end;
}

.acerto-card {
  border: 2px solid #000;
  padding: 8px 12px;
  width: 180px;
}

.acerto-title {
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #000;
  margin-bottom: 6px;
  padding-bottom: 4px;
}

.relatorio-acertos{
display: flex;
flex-direction: column;
}

.acerto-item {
  font-size: 12px;
  margin: 3px 0;
  text-align: right;
}
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
  <div class="section-title">Responsáveis</div>
  <div class="grid">
    <div class="item"><span class="label">Auditor:</span> ${auditoria.auditor?.nome}</div>
    <div class="item"><span class="label">Gerente:</span> ${auditoria.gerente?.nome}</div>
  </div>
</div>


<div class="section">
  <div class="section-title">Avaliações</div>
  <div class="grid">
    <div class="item"><span class="label">Organização da Loja:</span> ${auditoria.organizacaoLoja}</div>
    <div class="item"><span class="label">Organização do Depósito:</span> ${auditoria.organizacaoDeposito}</div>
    <div class="item"><span class="label">Limpeza:</span> ${auditoria.limpeza}</div>
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
  auditoria.produtosRelevantes?.length
    ? `
<div class="section">
  <div class="section-title">Produtos Relevantes</div>
  <ul>
    ${auditoria.produtosRelevantes.map((p) => `<li>${p}</li>`).join("")}
  </ul>
</div>
`
    : ""
}


<div class="result-box ${
    Number(auditoria.resultadoFinal.replace(".", "").replace(",", ".")) < 0
      ? "negative"
      : "positive"
  }">
  <div class="relatorio-acertos">Relatório de sobras e faltas
  <div>
<div>sobras R$: ${auditoria.sobras}</div>
<div>Faltas R$: ${auditoria.faltas}</div>
<div>Resultado Final: ${auditoria.resultadoFinal}</div>
</div>
</div>


<div class="section">
  <div class="section-title">Conclusão</div>
  ${auditoria.conclusao}
</div>

<footer>
  Relatório gerado automaticamente em ${new Date().toLocaleString("pt-BR")}
</footer>



</body>
</html>
`;
}

module.exports = { generateAuditHtml };
