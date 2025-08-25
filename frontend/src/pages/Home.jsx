import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import DoctorCard from "../components/DoctorCard";
import { Container, Row, Col } from "react-bootstrap";
import { getDoctors } from "../api/doctors";
import HolidayAlert from "../components/HolidayAlert";


export default function Home() {
  const [doctors, setDoctors] = useState([]);

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

  return (
    <>
      <HolidayAlert />
      <Hero />
      <Container className="py-5">
        <h2 className="mb-4"> Our Doctors</h2>
        <Row>
          {doctors.slice(0, 6).map((doc) => (
            <Col md={4} key={doc.id}>
              <DoctorCard doctor={doc} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
