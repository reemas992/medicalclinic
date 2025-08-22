import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light p-5 rounded mb-4 text-center">
      <Container>
        <h1>MediClinic – Complete Clinic Management</h1>
        <p>Manage appointments, evaluations, and more. Fast and secure!</p>
        <Button variant="primary" className="me-2" onClick={() => navigate("/contact")}>
          Contact Us
        </Button>
        <Button variant="success" onClick={() => navigate("/patient-pdf")}>
          Fill Patient Form
        </Button>
      </Container>
    </div>
  );
};

export default HeroSection;
