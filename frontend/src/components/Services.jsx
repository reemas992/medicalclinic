// src/components/Service.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const servicesData = [
  {
    category: "Pediatric and Adolescent Services",
    items: [
      "Preventive examinations",
      "Developmental diagnostics",
      "Vaccinations (Parents can be vaccinated simultaneously)",
      "Ultrasound examinations (e.g., skull, abdomen, kidneys)",
      "Acute care",
      "Preoperative diagnostics",
      "Social pediatric consultation / evaluation",
      "Basic psychosomatic care"
    ]
  },
  {
    category: "Pediatric Cardiology Services",
    items: [
      "Electrocardiography (resting ECG)",
      "Holter ECG (long-term ECG)",
      "Long-term blood pressure monitoring",
      "2D ultrasound of the heart and major vessels (2D echocardiography)",
      "3D ultrasound of the heart (3D echocardiography)",
      "Ultrasound of carotid arteries with wall thickness measurement (Carotid IMT)",
      "Bicycle stress test (Ergometrics)"
    ]
  },
  {
    category: "Individual Health Services (IGeL Services)",
    items: [
      "Examinations under the Youth Employment Protection Act (JArbSchG) – private service",
      "Medical certificates (e.g., daycare and school)",
      "Fitness exams (e.g., sports, daycare)",
      "Diving medicine clearance (ages 15-39)",
      "Additional early detection tests up to age 14 (vision & hearing)",
      "Amblyopia screening from 7th month (Spot Vision Screener)",
      "Written medical applications",
      "Blood tests (optional)",
      "Nutritional medicine treatments",
      "Spa/rehabilitation exams outside statutory insurance",
      "Travel medicine consultation",
      "Additional vaccinations like Yellow Fever",
      "Adoption assessments"
    ]
  }
];

export default function Service() {
  return (
    <Container className="py-5">
      <h2 className="text-primary mb-4 text-center">Our Services</h2>
      <Row>
        {servicesData.map((service, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-secondary mb-3">{service.category}</Card.Title>
                <ul className="list-unstyled mb-0">
                  {service.items.map((item, i) => (
                    <li key={i} className="mb-2">
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <footer className="text-center mt-5">
        <p>© 2025 Medical Clinic</p>
      </footer>
    </Container>
  );
}
