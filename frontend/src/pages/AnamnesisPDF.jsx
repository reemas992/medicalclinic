// AnamnesisPDF.js
import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { Button, Container, Card } from "react-bootstrap";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  content: {
    marginLeft: 10,
  },
});

// PDF Document Component
const AnamnesisDocument = ({ patient }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Allgemeine ärztliche Anamnese</Text>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Name:</Text> {patient.name}</Text>
        <Text><Text style={styles.label}>Geburtsdatum:</Text> {patient.birthDate}</Text>
        <Text><Text style={styles.label}>Geschlecht:</Text> {patient.gender}</Text>
        <Text><Text style={styles.label}>Adresse:</Text> {patient.address}</Text>
        <Text><Text style={styles.label}>Telefon:</Text> {patient.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Beschwerden / Symptome:</Text>
        <Text style={styles.content}>{patient.symptoms || "-"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vorerkrankungen:</Text>
        <Text style={styles.content}>{patient.medicalHistory || "-"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Allergien:</Text>
        <Text style={styles.content}>{patient.allergies || "-"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Medikamente:</Text>
        <Text style={styles.content}>{patient.medications || "-"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Familienanamnese:</Text>
        <Text style={styles.content}>{patient.familyHistory || "-"}</Text>
      </View>
    </Page>
  </Document>
);

// React-Bootstrap Component
const AnamnesisPDFComponent = ({ patient }) => {
  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card style={{ width: "400px", padding: "20px", textAlign: "center" }}>
        <Card.Body>
          <Card.Title>PDF Anamnese</Card.Title>
          <Card.Text>
            Klicken Sie auf den Button, um die Anamnese als PDF herunterzuladen.
          </Card.Text>
          <PDFDownloadLink
            document={<AnamnesisDocument patient={patient} />}
            fileName={`${patient.name.replace(" ", "_")}_Anamnese.pdf`}
            style={{ textDecoration: "none" }}
          >
            {({ loading }) => (
              <Button variant="primary" disabled={loading}>
                {loading ? "Lade PDF..." : "PDF Anamnese herunterladen"}
              </Button>
            )}
          </PDFDownloadLink>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AnamnesisPDFComponent;
