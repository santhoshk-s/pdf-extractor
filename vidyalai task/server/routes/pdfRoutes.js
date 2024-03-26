const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const pdfController = require("../controllers/pdfController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
router.post("/upload", upload.single("pdf"), fileController.uploadFile);
router.get("/retrieve/:fileId", fileController.retrieveFile);
router.get("/retrive-all-files", fileController.retrieveAllFiles);

module.exports = router; 
