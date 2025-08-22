import PDFForm from "../components/AnamnesisPDF";

const PatientPDFForm = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Patient Medical Form</h2>
      <PDFForm />
    </div>
  );
};

export default PatientPDFForm;
