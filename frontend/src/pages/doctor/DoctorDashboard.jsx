import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Badge, Row, Col, Form } from "react-bootstrap";
import { getMyAppointments, cancelAppointment } from "../../api/appointments";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelAppointment(selectedAppointment.id);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, status: "cancelled" } : a
        )
      );
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered appointments based on selected filter
  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  // Statistics
  const total = appointments.length;
  const upcoming = appointments.filter(a => a.status === "upcoming").length;
  const cancelled = appointments.filter(a => a.status === "cancelled").length;

  return (
    <Container className="py-5">
      <h2>Doctor Dashboard</h2>

      {/* Statistics */}
      <Row className="mb-3">
        <Col>
          <Badge bg="primary" className="me-2">Total: {total}</Badge>
          <Badge bg="success" className="me-2">Upcoming: {upcoming}</Badge>
          <Badge bg="danger">Cancelled: {cancelled}</Badge>
        </Col>
        <Col xs="auto">
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.patient?.name}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td>
                {a.status === "cancelled" ? (
                  <Badge bg="danger">Cancelled</Badge>
                ) : (
                  <Badge bg="success">{a.status}</Badge>
                )}
              </td>
              <td>
                {a.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleCancelClick(a)}
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment with{" "}
          <strong>{selectedAppointment?.patient?.name}</strong> on{" "}
          <strong>{selectedAppointment && new Date(selectedAppointment.date).toLocaleString()}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
