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

   const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "phone" && value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    setPatientData({ ...patientData, [name]: value });
  };



 

  const validateForm = () => {
    let newErrors = {};
    Object.entries(patientData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("✅ Patient data submitted:", patientData);
   
    }
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
                <Button variant="success" size="lg" className="m-3" onClick={() => window.location.href = "/location"}  >
                      🚗 How do you find us?
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
              <p className="lead mb-4">We have a dedicated team working for your comfort and health.</p>
              <Button variant="success" size="lg" onClick={() => setShowForm(true)}>
                Fill Patient Form
              </Button>
               <Button variant="success" size="lg" className="m-3" onClick={() => window.location.href = "/location"}  >
                      🚗 How do you find us?
                    </Button>

            </Container>
          </div>
        </Carousel.Item>
        

{/* ✅ Slide 3 */}
  <Carousel.Item>
    <div
      style={{
        ...carouselItemStyle,
        backgroundImage:
          "url('https://png.pngtree.com/background/20230402/original/pngtree-dentist-and-senior-patient-discussing-over-x-ray-at-clinic-vector-picture-image_2261018.jpg')",
      }}
    >
      <div style={overlayStyle}></div>
      <Container
        style={contentStyle}
        className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-light"
      >
        <h1 className="fw-bold mb-3">Your Health, Our Priority</h1>
        <p className="lead mb-4">
          We have a dedicated team working for your comfort and health.
        </p>
        <Button variant="success" size="lg" onClick={() => setShowForm(true)}>
          Fill Patient Form
        </Button>
        <Button variant="success" size="lg" className="m-3" onClick={() => window.location.href = "/location"}  >
             🚗 How do you find us?
         </Button>
      </Container>
    </div>
  </Carousel.Item>
</Carousel>
    

      {/* Modal for Anamnesis Form */}
   {/* Modal for Anamnesis Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Patient Anamnesis Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={patientData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* Birth Date */}
            <div className="mb-2">
              <label>Birth Date</label>
              <input
                type="date"
                className="form-control"
                name="birthDate"
                value={patientData.birthDate}
                onChange={handleChange}
                required
              />
              {errors.birthDate && (
                <small className="text-danger">{errors.birthDate}</small>
              )}
            </div>

            {/* Gender (select) */}
            <div className="mb-2">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={patientData.gender}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <small className="text-danger">{errors.gender}</small>
              )}
            </div>

            {/* Address */}
            <div className="mb-2">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={patientData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </div>

            {/* Phone (numbers only) */}
            <div className="mb-2">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={patientData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </div>

            {/* Symptoms */}
            <div className="mb-2">
              <label>Symptoms</label>
              <textarea
                className="form-control"
                name="symptoms"
                value={patientData.symptoms}
                onChange={handleChange}
                required
              />
              {errors.symptoms && (
                <small className="text-danger">{errors.symptoms}</small>
              )}
            </div>

            {/* Medical History */}
            <div className="mb-2">
              <label>Medical History</label>
              <textarea
                className="form-control"
                name="medicalHistory"
                value={patientData.medicalHistory}
                onChange={handleChange}
                required
              />
              {errors.medicalHistory && (
                <small className="text-danger">{errors.medicalHistory}</small>
              )}
            </div>

            {/* Allergies */}
            <div className="mb-2">
              <label>Allergies</label>
              <textarea
                className="form-control"
                name="allergies"
                value={patientData.allergies}
                onChange={handleChange}
                required
              />
              {errors.allergies && (
                <small className="text-danger">{errors.allergies}</small>
              )}
            </div>

            {/* Medications */}
            <div className="mb-2">
              <label>Medications</label>
              <textarea
                className="form-control"
                name="medications"
                value={patientData.medications}
                onChange={handleChange}
                required
              />
              {errors.medications && (
                <small className="text-danger">{errors.medications}</small>
              )}
            </div>

            {/* Family History */}
            <div className="mb-2">
              <label>Family History</label>
              <textarea
                className="form-control"
                name="familyHistory"
                value={patientData.familyHistory}
                onChange={handleChange}
                required
              />
              {errors.familyHistory && (
                <small className="text-danger">{errors.familyHistory}</small>
              )}
            </div>

            <Modal.Footer>
              <AnamnesisPDF patient={patientData} />
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Close
              </Button>
              <Button variant="success" type="submit">
                Save Form
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HeroSection;
