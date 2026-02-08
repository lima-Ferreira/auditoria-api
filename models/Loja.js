const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LojaSchema = new Schema(
  {
    razao: { type: String, required: true, trim: true },
    fantasia: { type: String, required: true, trim: true },
    endereco: { type: String, required: true, trim: true },
    cidade: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    cnpj: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loja", LojaSchema);
