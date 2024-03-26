import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Typography, Card, CardContent } from "@mui/material";

// Set the worker source directly
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

const PdfDisplay = ({ fileId }) => {
  const pdfUrl = `http://localhost:8080/api/retrieve/${fileId}`;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" color={"green"} gutterBottom>
          Display PDF 
        </Typography>
        {fileId ? (
          <Document
            file={{ url: pdfUrl }}
            options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }}>
            <Page pageNumber={1} width={350} />
          </Document>
        ) : (
          <Typography color="error">
            Failed to load PDF file.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfDisplay;
