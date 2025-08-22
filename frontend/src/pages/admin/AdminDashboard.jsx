import React, { useEffect, useState } from "react";
import { Container, Table, Button, Tabs, Tab } from "react-bootstrap";
import { getAllAppointments, updateAppointmentStatus } from "../../api/appointments";
import { getDoctors } from "../../api/doctors";
import { getJobs, deleteJob } from "../../api/jobs";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [key, setKey] = useState("appointments");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppointments(await getAllAppointments());
        setDoctors(await getDoctors());
        setJobs(await getJobs());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Update appointment status
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2>Admin Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">

        {/* Appointments */}
        <Tab eventKey="appointments" title="Appointments">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.user?.name || "N/A"}</td>
                  <td>{a.status}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => handleStatusUpdate(a.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusUpdate(a.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Doctors */}
        <Tab eventKey="doctors" title="Doctors">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialty</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.user?.name || "N/A"}</td>
                  <td>{doc.specialty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Jobs */}
        <Tab eventKey="jobs" title="Jobs">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Description</th>
                <th>Requirements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.status}</td>
                  <td>{job.description}</td>
                  <td>{job.requirements}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
}
