const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GerenteSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gerente", GerenteSchema);
