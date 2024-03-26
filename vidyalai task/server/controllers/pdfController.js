const { PDFDocument } = require("pdf-lib");

const extractPages = async (req, res) => {
  try {
    const { originalPDF, selectedPages } = req.body;

    const pdfDoc = await PDFDocument.load(originalPDF);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNum of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newPdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.send(newPdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  extractPages,
};
