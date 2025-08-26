import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5 w-100">
      <Container>
        <Row>
          <Col md={6}>
            <h5>MediClinic</h5>
            <p>© 2025 MediClinic. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>Contact: info@mediclinic.com | Phone: +123 456 7890</p>
            <p>Address: Bolmeen Str. 1 – 04013 Berlin Deutschland         </p>
          
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
