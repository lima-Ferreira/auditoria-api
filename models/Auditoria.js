const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuditoriaSchema = new Schema(
  {
    data: { type: Date, required: true },

    acertoEntrada: {
      type: Number,
      default: 0,
    },

    acertoSaida: {
      type: Number,
      default: 0,
    },

    loja: {
      type: Schema.Types.ObjectId,
      ref: "Loja",
      required: true,
    },

    gerente: {
      type: Schema.Types.ObjectId,
      ref: "Gerente",
      required: true,
    },

    auditor: {
      type: Schema.Types.ObjectId,
      ref: "Auditor",
      required: true,
    },

    organizacaoLoja: { type: String, required: true, trim: true },
    organizacaoDeposito: { type: String, required: true, trim: true },
    limpeza: { type: String, required: true, trim: true },
    fardamentos: { type: String, required: true, trim: true },
    caixa_1: { type: String, required: true, trim: true },
    caixa_2: { type: String, required: true, trim: true },
    caixa_3: { type: String, required: true, trim: true },
    vig_sanitaria: { type: String, required: true, trim: true },
    alvara: { type: String, required: true, trim: true },
    bombeiros: { type: String, required: true, trim: true },

    produtosRelevantes: { type: [String], default: [] },

    sobras: { type: String, required: true },
    faltas: { type: String, required: true },
    resultadoFinal: { type: String, required: true },
    conclusao: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auditoria", AuditoriaSchema);
