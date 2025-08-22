import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { getMyAppointments, cancelAppointment } from "../../api/appointments";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointments(await getMyAppointments());
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2>Doctor Dashboard</h2>
      <Table striped bordered hover>
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
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.patient?.name}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>
                {a.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleCancel(a.id)}
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
