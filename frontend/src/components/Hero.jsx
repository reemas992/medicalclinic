import { Carousel, Button, Container, Modal } from "react-bootstrap";
import { useState } from "react";
import AnamnesisPDF from "./AnamnesisPDF";

const HeroSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    symptoms: "",
    medicalHistory: "",
    allergies: "",
    medications: "",
    familyHistory: ""
  });

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const carouselItemStyle = {
    height: "70vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    marginTop: "3rem",
    padding: "2rem",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  };

  const contentStyle = {
    position: "relative",
    zIndex: 2,
  };

  return (
    <>
      <Carousel fade className="hero-carousel">
        {/* Slide 1 */}
        <Carousel.Item>
          <div style={{ ...carouselItemStyle, backgroundImage: "url('https://th.bing.com/th/id/OIP.r_OrHHPi7UW-bhdd5_iy6QHaE8?w=270&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')" }}>
            <div style={overlayStyle}></div>
            <Container style={contentStyle} className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-light">
              <h1 className="fw-bold mb-3">Welcome to MediClinic</h1>
              <p className="lead mb-4">Manage appointments, evaluations, and more.</p>
              <Button variant="success" size="lg" onClick={() => setShowForm(true)}>
                Fill Patient Form
              </Button>
            </Container>
          </div>
        </Carousel.Item>
        {/* Slide 2 */}
        <Carousel.Item>
          <div style={{ ...carouselItemStyle, backgroundImage: "url('https://th.bing.com/th/id/OIP.nzpfd7b7YGPauEbOHVjVZwHaDO?w=349&h=152&c=7&r=0&o=5&dpr=1.3&pid=1.7')" }}>
            <div style={overlayStyle}></div>
            <Container style={contentStyle} className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-light">
              <h1 className="fw-bold mb-3">Fast & Reliable</h1>
              <p className="lead mb-4">Streamline clinic operations effortlessly.</p>
              <Button variant="success" size="lg" onClick={() => setShowForm(true)}>
                Fill Patient Form
              </Button>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Modal for Anamnesis Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📝Patient Anamnesis Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-2">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={patientData.name} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Birth Date</label>
              <input type="date" className="form-control" name="birthDate" value={patientData.birthDate} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Gender</label>
              <input type="text" className="form-control" name="gender" value={patientData.gender} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Address</label>
              <input type="text" className="form-control" name="address" value={patientData.address} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Phone</label>
              <input type="text" className="form-control" name="phone" value={patientData.phone} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Symptoms</label>
              <textarea className="form-control" name="symptoms" value={patientData.symptoms} onChange={handleChange}></textarea>
            </div>
            <div className="mb-2">
              <label>Medical History</label>
              <textarea className="form-control" name="medicalHistory" value={patientData.medicalHistory} onChange={handleChange}></textarea>
            </div>
            <div className="mb-2">
              <label>Allergies</label>
              <textarea className="form-control" name="allergies" value={patientData.allergies} onChange={handleChange}></textarea>
            </div>
            <div className="mb-2">
              <label>Medications</label>
              <textarea className="form-control" name="medications" value={patientData.medications} onChange={handleChange}></textarea>
            </div>
            <div className="mb-2">
              <label>Family History</label>
              <textarea className="form-control" name="familyHistory" value={patientData.familyHistory} onChange={handleChange}></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <AnamnesisPDF patient={patientData} />
          <Button variant="secondary" onClick={() => setShowForm(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HeroSection;
