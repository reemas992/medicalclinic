// AnamnesisPDFEmpty.js
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    marginLeft: 10,
    minHeight: 25, // blank space for user to fill in
    borderBottom: "1px solid #000", // underline for manual input
    marginBottom: 15,
  },
});

// PDF Document Component (Empty)
const AnamnesisDocumentEmpty = () => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>General Medical Anamnesis</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.content}></Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.content}></Text>

        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.content}></Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.content}></Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.content}></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Complaints / Symptoms:</Text>
        <Text style={styles.content}></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Past Medical History:</Text>
        <Text style={styles.content}></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.content}></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Medications:</Text>
        <Text style={styles.content}></Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Family History:</Text>
        <Text style={styles.content}></Text>
      </View>
    </Page>
  </Document>
);

// React-Bootstrap Component for download
const AnamnesisPDFEmptyComponent = () => {
  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card style={{ width: "400px", padding: "20px", textAlign: "center" }}>
        <Card.Body>
          <Card.Title>Empty Anamnesis PDF</Card.Title>
          <Card.Text>
            You can download this empty form and fill it manually if you wish.
          </Card.Text>
          <PDFDownloadLink
            document={<AnamnesisDocumentEmpty />}
            fileName={`Anamnesis_Empty.pdf`}
            style={{ textDecoration: "none" }}
          >
            {({ loading }) => (
              <Button variant="primary" disabled={loading}>
                {loading ? "Loading PDF..." : "Download Empty PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AnamnesisPDFEmptyComponent;
