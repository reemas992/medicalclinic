import { Container, Form, Button } from "react-bootstrap";

const ContactPage = () => {
  return (
    <Container className="py-5">
      <h2>Contact Us</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Your Name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Your Email" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={4} />
        </Form.Group>
        <Button variant="primary">Send</Button>
      </Form>
    </Container>
  );
};

export default ContactPage;
