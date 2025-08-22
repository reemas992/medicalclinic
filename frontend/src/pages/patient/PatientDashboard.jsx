import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyAppointments, cancelAppointment } from "../../api/appointments";
import { createEvaluation } from "../../api/evaluations";
import { getJobs } from "../../api/jobs";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [evaluations, setEvaluations] = useState({}); // {appointmentId: {rating, comment}}
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchJobs();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      toast.error("Failed to load appointments");
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  // Cancel appointment
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      toast.info("Appointment canceled");
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to cancel appointment");
      console.error(err);
    }
  };

  // Submit evaluation
  const handleEvaluation = async (appointmentId) => {
    try {
      const data = evaluations[appointmentId];
      if (!data?.rating) {
        toast.warning("Please select a rating first!");
        return;
      }

      await createEvaluation({ appointmentId, ...data });
      toast.success("Evaluation submitted!");
      setEvaluations({ ...evaluations, [appointmentId]: {} });
    } catch (err) {
      toast.error("Failed to submit evaluation");
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-primary mb-4">My Appointments</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Evaluation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.doctor?.user?.name}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>
                {a.status === "completed" ? (
                  <>
                    <Form.Select
                      size="sm"
                      className="mb-2"
                      value={evaluations[a.id]?.rating || ""}
                      onChange={(e) =>
                        setEvaluations({
                          ...evaluations,
                          [a.id]: { ...evaluations[a.id], rating: e.target.value },
                        })
                      }
                    >
                      <option value="">Rate</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Select>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Leave a comment"
                      value={evaluations[a.id]?.comment || ""}
                      onChange={(e) =>
                        setEvaluations({
                          ...evaluations,
                          [a.id]: { ...evaluations[a.id], comment: e.target.value },
                        })
                      }
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      variant="success"
                      onClick={() => handleEvaluation(a.id)}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <em>N/A</em>
                )}
              </td>
              <td>
                {a.status === "booked" && (
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

      <h2 className="text-primary mt-5 mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} className="mb-3">
            <Card.Body>
              <h5>{job.title} - {job.department} ({job.status})</h5>
              <p>{job.description}</p>
              <small>{job.requirements}</small>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
