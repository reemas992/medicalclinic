import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DoctorCard from "../components/DoctorCard";
import { getDoctors } from "../api/doctors";
import { bookAppointment } from "../api/appointments";
import ToastMessage from "../components/ToastMessage";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async (doctorId) => {
    try {
      await bookAppointment({ doctorId });
      setToast({ show: true, message: "Appointment booked successfully!", variant: "success" });
    } catch (err) {
      setToast({ show: true, message: "Failed to book appointment", variant: "danger" });
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Our Doctors</h2>
      <Row>
        {doctors.map((doc) => (
          <Col md={4} key={doc.id}>
            <DoctorCard doctor={doc} onBook={handleBook} />
          </Col>
        ))}
      </Row>
      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </Container>
  );
}
