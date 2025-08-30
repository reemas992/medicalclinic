import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DoctorCard from "../components/DoctorCard";
import { getDoctors } from "../api/doctors";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctors"); 
      }
    };
    fetchDoctors();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Our Doctors</h2>
      <Row>
        {doctors.map((doc) => (
          <Col md={4} key={doc.id}>
            <DoctorCard doctor={doc} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
