import React, { useEffect, useState } from "react";
import { Container, Table, Button, Tabs, Tab, Modal, Form } from "react-bootstrap";
import { getAllAppointments, updateAppointmentStatus } from "../../api/appointments";
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from "../../api/doctors";
import { getJobs, createJob, updateJob, deleteJob } from "../../api/jobs";
import HolidaysTab from "../../components/HolidaysTab";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [key, setKey] = useState("appointments");

  // Modals state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ type: "", id: null });

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    experience_years: 0,
  });

  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    status: "open",
    description: "",
    requirements: ""
  });

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

  // Generic Delete
  const handleDeleteClick = (type, id) => {
    setConfirmData({ type, id });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      switch (confirmData.type) {
        case "doctor":
            console.log("Deleting doctor with ID:", confirmData.id),
          await deleteDoctor(confirmData.id);
          setDoctors(prev => prev.filter(d => d.id !== confirmData.id));
          break;
        case "job":
          await deleteJob(confirmData.id);
          setJobs(prev => prev.filter(j => j.id !== confirmData.id));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
    setShowConfirm(false);
  };

  const handleCancelDelete = () => setShowConfirm(false);

  // Appointment
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) { console.error(err); }
  };

  // Doctor
  const handleEditDoctor = (doc) => {
    setSelectedDoctor({
      id: doc.id,
      specialty: doc.specialty,
      experience_years: doc.experience_years,
    });
    setShowDoctorModal(true);
  };

  const handleUpdateDoctor = async () => {
    try {
      const updated = await updateDoctor(selectedDoctor.id, selectedDoctor);
      setDoctors(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
      setShowDoctorModal(false);
    } catch (err) { console.error(err); }
  };

  const handleAddDoctor = async () => {
  try {
    const created = await addDoctor(newDoctor);
    setDoctors(prev => [created, ...prev]);
    setShowAddDoctorModal(false);
    setNewDoctor({ userId: "", name: "", specialty: "", experience_years: 0 });
  } catch (err) {
    console.error(err);
  }
};


  // Job
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };
  const handleUpdateJob = async () => {
    try {
      const updated = await updateJob(selectedJob.id, selectedJob);
      setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
      setShowJobModal(false);
    } catch (err) { console.error(err); }
  };
  const handleAddJob = async () => {
    try {
      const created = await createJob(newJob);
      setJobs(prev => [created, ...prev]);
      setShowAddJobModal(false);
      setNewJob({ title: "", department: "", status: "open", description: "", requirements: "" });
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
                <th>ID</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.user?.name || "N/A"}</td>
                  <td>{a.status}</td>
                  <td>
                    <Button size="sm" variant="success" className="me-2"
                      onClick={() => handleStatusUpdate(a.id, "confirmed")}>Confirm</Button>
                    <Button size="sm" variant="danger"
                      onClick={() => handleStatusUpdate(a.id, "cancelled")}>Cancel</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Doctors */}
        <Tab eventKey="doctors" title="Doctors">
          <Button variant="primary" className="mb-3" onClick={() => setShowAddDoctorModal(true)}>Add Doctor</Button>
          <Table striped bordered hover>
            <thead><tr><th>ID</th><th>Name</th><th>Specialty</th><th>Experience Years</th><th>Actions</th></tr></thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.user?.name || doc.name || "N/A"}</td>
                  <td>{doc.specialty}</td>
                  <td>{doc.experience_years}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2"
                      onClick={() => handleEditDoctor(doc)}>Edit</Button>
                    <Button size="sm" variant="danger"
                      onClick={() => handleDeleteClick("doctor", doc.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Jobs */}
        <Tab eventKey="jobs" title="Jobs">
          <Button variant="primary" className="mb-3" onClick={() => setShowAddJobModal(true)}>Add Job</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Department</th><th>Status</th><th>Description</th><th>Requirements</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.status}</td>
                  <td>{job.description}</td>
                  <td>{job.requirements}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleEditJob(job)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteClick("job", job.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Holidays */}
        <Tab eventKey="holidays" title="Holidays">
          <HolidaysTab />
        </Tab>

      </Tabs>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this {confirmData.type}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Doctor Modal */}
<Modal show={showAddDoctorModal} onHide={() => setShowAddDoctorModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add Doctor</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="number"
          value={newDoctor.userId}
          onChange={e => setNewDoctor({...newDoctor, userId: e.target.value})}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={newDoctor.name}
          onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Specialty</Form.Label>
        <Form.Control
          type="text"
          value={newDoctor.specialty}
          onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Experience Years</Form.Label>
        <Form.Control
          type="number"
          value={newDoctor.experience_years}
          onChange={e => setNewDoctor({...newDoctor, experience_years: e.target.value})}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          value={newDoctor.image}
          onChange={e => setNewDoctor({...newDoctor, image: e.target.value})}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddDoctorModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleAddDoctor}>Add Doctor</Button>
  </Modal.Footer>
</Modal>

{/* Edit Doctor Modal */}
<Modal show={showDoctorModal} onHide={() => setShowDoctorModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Doctor</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedDoctor && (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={selectedDoctor.name}
            onChange={e => setSelectedDoctor({...selectedDoctor, name: e.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            type="text"
            value={selectedDoctor.specialty}
            onChange={e => setSelectedDoctor({...selectedDoctor, specialty: e.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Experience Years</Form.Label>
          <Form.Control
            type="number"
            value={selectedDoctor.experience_years}
            onChange={e => setSelectedDoctor({...selectedDoctor, experience_years: e.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={selectedDoctor.image}
            onChange={e => setSelectedDoctor({...selectedDoctor, image: e.target.value})}
          />
        </Form.Group>
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDoctorModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleUpdateDoctor}>Save Changes</Button>
  </Modal.Footer>
</Modal>

      {/* Edit Job Modal */}
      <Modal show={showJobModal} onHide={() => setShowJobModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Job</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedJob && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control value={selectedJob.title} onChange={e => setSelectedJob({...selectedJob, title: e.target.value})}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control value={selectedJob.department} onChange={e => setSelectedJob({...selectedJob, department: e.target.value})}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control value={selectedJob.status} onChange={e => setSelectedJob({...selectedJob, status: e.target.value})}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={selectedJob.description} onChange={e => setSelectedJob({...selectedJob, description: e.target.value})}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Requirements</Form.Label>
                <Form.Control as="textarea" rows={3} value={selectedJob.requirements} onChange={e => setSelectedJob({...selectedJob, requirements: e.target.value})}/>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJobModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateJob}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Job Modal */}
      <Modal show={showAddJobModal} onHide={() => setShowAddJobModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Job</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control as="textarea" rows={3} value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddJobModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddJob}>Add Job</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
