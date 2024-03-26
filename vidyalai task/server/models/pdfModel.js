const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const PdfModel = mongoose.model("Pdf", pdfSchema);

module.exports = PdfModel;
