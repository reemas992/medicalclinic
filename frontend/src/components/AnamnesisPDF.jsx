import React from "react";
import { Button } from "react-bootstrap";

export default function AnamnesisPDF({ patient }) {
  const generatePDF = () => {
    const content = `
      Patient Name: ${patient.name}
      Age: ${patient.age}
      Gender: ${patient.gender}
      Diagnosis: ${patient.diagnosis}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anamnesis.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button size="sm" onClick={generatePDF}>
      Download Report
    </Button>
  );
}
