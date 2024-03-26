const PdfModel = require("../models/pdfModel");
const mime = require("mime-types");
const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf-parse");

const uploadFile = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    console.log("Received file details:", {
      originalname,
      size: buffer.length,
    });

    const mimeType = mime.lookup(originalname);
    if (mimeType !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files is allowed please check if that you uploaded pdf files only." });
    }

    const pdf = new PdfModel({
      filename: originalname,
      path: buffer.toString("base64"),
    });

    const savedPdf = await pdf.save();
    res
      .status(200)
      .json({ message: "File uploaded successfully", fileId: savedPdf._id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const retrieveFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const pdf = await PdfModel.findById(fileId);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    const buffer = Buffer.from(pdf.path, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${pdf.filename}`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const retrieveAllFiles = async (req, res) => {
  try {
    const allPdfs = await PdfModel.find();

    const pdfData = allPdfs.map((pdf) => ({
      fileId: pdf._id,
      filename: pdf.filename,
    }));

    res.status(200).json(pdfData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadFile,
  retrieveFile,
  retrieveAllFiles,
};
