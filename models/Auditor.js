const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AuditorSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auditor", AuditorSchema);
