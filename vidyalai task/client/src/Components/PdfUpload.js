import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument } from "pdf-lib";
import {
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";
import './pdfUpload.css'

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOriginalPdfUrl(null);
    setGeneratedPdfUrl(null);
  };

  const handleCheckboxChange = (pageNumber) => {
    const newSelectedPages = selectedPages.includes(pageNumber)
      ? selectedPages.filter((page) => page !== pageNumber)
      : [...selectedPages, pageNumber];

    setSelectedPages(newSelectedPages);
  };

  const handleUpload = async () => {
    if (file) {
      setOriginalPdfUrl(URL.createObjectURL(file));

      try {
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await axios.post(
          "https://backendvidyalai.onrender.com/api/upload",
          formData
        );

        console.log(response.data);
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  const createPdf = async () => {
    setIsCreatingPdf(true);

    try {
      if (!file) {
        console.error("No file selected");
        return;
      }

      const existingPdfBytes = await fetch(URL.createObjectURL(file)).then(
        (res) => res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const newPdfDoc = await PDFDocument.create();
      for (const pageNumber of selectedPages) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [
          pageNumber - 1,
        ]);
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setGeneratedPdfUrl(url);
    } catch (error) {
      console.error("Error creating PDF:", error);
    }

    setIsCreatingPdf(false);
  };

  useEffect(() => {
    const updateSelectedPages = async () => {
      try {
        if (file) {
          const existingPdfBytes = await fetch(URL.createObjectURL(file)).then(
            (res) => res.arrayBuffer()
          );
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const numPages = pdfDoc.getPageCount();

          if (selectedPages.length === 0) {
            setSelectedPages(
              [...Array(numPages).keys()].map((pageNumber) => pageNumber + 1)
            );
          }
        }
      } catch (error) {
        console.error("Error updating selected pages:", error);
      }
    };

    updateSelectedPages();
  }, [file, selectedPages]);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px",backgroundColor:"#FEFDED",height:"70vh" }}>
        <Typography variant="h5" color={"gray"} gutterBottom>
          Choose File and Upload
        </Typography>
        <input
        id="input"
          type="file"
          onChange={onFileChange}
          style={{ marginBottom: "20px" }}
        />
        {/* <label  className="label" htmlFor="input">Choose file</label> */}
        {/* <Button
          variant="contained"
          onClick={handleUpload}
          style={{ marginBottom: "20px" }}>
          Upload PDF
        </Button> */}
        <button onClick={handleUpload} className="btn" >Upload PDF</button>
        {file && originalPdfUrl && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Original PDF
              </Typography>
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
                <Viewer fileUrl={originalPdfUrl} />
              </Worker>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Generated PDF
              </Typography>
              {generatedPdfUrl && (
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
                  <Viewer fileUrl={generatedPdfUrl} />
                </Worker>
              )}
            </Grid>
          </Grid>
        )}
        {selectedPages && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="h6" gutterBottom>
            Page selection:
            </Typography>
            {[...Array(selectedPages.length).keys()].map((index) => (
              <FormControlLabel
                key={selectedPages[index]}
                control={
                  <Checkbox
                    checked={selectedPages.includes(selectedPages[index])}
                    onChange={() => handleCheckboxChange(selectedPages[index])}
                  />
                }
                label={`Page ${selectedPages[index]}`}
              />
            ))}
            <Button
              variant="contained"
              onClick={createPdf}
              disabled={isCreatingPdf}
              style={{ marginTop: "10px" }}>
              Create PDF
            </Button>
            {downloadUrl && (
              <Button
                variant="contained"
                onClick={() => window.open(downloadUrl)}
                style={{ marginTop: "10px", marginLeft: "10px" }}>
                Download Selected Pages
              </Button>
            )}
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default PdfUpload;
