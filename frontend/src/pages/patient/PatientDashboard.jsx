import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyAppointments, bookAppointment, cancelAppointment } from "../../api/appointments";
import { getDoctors } from "../../api/doctors";
import moment from "moment";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "", onConfirm: null });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
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

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const handleDoctorChange = (doctorId) => {
    const doc = doctors.find(d => d.id === parseInt(doctorId));
    setSelectedDoctor(doc);
    setSelectedDate("");
    setAvailableTimes([]);
    setSelectedTime("");
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime("");

    if (!selectedDoctor) return;

    const dayOfWeek = moment(date).day();

    const schedule = selectedDoctor.schedules?.find(s => s.dayOfWeek === dayOfWeek);
    if (!schedule) {
      setAvailableTimes([]);
      toast.info("Doctor is not available on this day. Please choose another date.");
      return;
    }

    let times = [];
    let start = moment(schedule.startTime, "HH:mm:ss");
    const end = moment(schedule.endTime, "HH:mm:ss");

    while (start.isBefore(end)) {
      const t = start.format("HH:mm");
      const inBreak = schedule.breaks?.some(b => {
        const bStart = moment(b.start, "HH:mm:ss");
        const bEnd = moment(b.end, "HH:mm:ss");
        return start.isBetween(bStart, bEnd, null, '[)');
      });
      if (!inBreak) times.push(t);
      start.add(30, "minutes");
    }

    const booked = appointments
      .filter(a => a.doctorId === selectedDoctor.id && moment(a.date).format("YYYY-MM-DD") === date)
      .map(a => moment(a.date).format("HH:mm"));
    times = times.filter(t => !booked.includes(t));

    setAvailableTimes(times);
  };

  const handleTimeChange = (e) => setSelectedTime(e.target.value);

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.warning("Please select doctor, date, and time.");
      return;
    }
    setModalContent({
      title: "Confirm Booking",
      body: `Do you want to book an appointment with ${selectedDoctor.user.name} on ${selectedDate} at ${selectedTime}?`,
      onConfirm: confirmBook
    });
    setShowModal(true);
  };

  const confirmBook = async () => {
    try {
      const datetime = moment(`${selectedDate} ${selectedTime}`, "YYYY-MM-DD HH:mm").toISOString();
      await bookAppointment({ doctorId: selectedDoctor.id, date: datetime });
      toast.success("Appointment booked successfully!");
      fetchAppointments();
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimes([]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  const handleCancel = (appt) => {
    setModalContent({
      title: "Confirm Cancellation",
      body: `Are you sure you want to cancel this appointment on ${moment(appt.date).format("YYYY-MM-DD HH:mm")}?`,
      onConfirm: () => confirmCancel(appt.id)
    });
    setShowModal(true);
  };

  const confirmCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.info("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error("Cancellation failed");
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  // Generate readable schedule text
  const renderDoctorSchedule = (schedules) => {
    if (!schedules || schedules.length === 0) return "No schedule available";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return schedules.map(s => {
      return `${days[s.dayOfWeek]}: ${s.startTime} - ${s.endTime}`;
    }).join("; ");
  };

  return (
    <Container className="py-5">
      <h2 className="text-primary mb-4">My Appointments</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.doctor?.user?.name}</td>
              <td>{moment(a.date).format("YYYY-MM-DD HH:mm")}</td>
              <td>{a.status}</td>
              <td>
                {a.status === "scheduled" && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(a)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="text-primary mt-5 mb-3">Book a New Appointment</h2>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Select Doctor</Form.Label>
          <Form.Select onChange={e => handleDoctorChange(e.target.value)}>
            <option value="">-- Select Doctor --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.user.name} ({d.specialty}) - {renderDoctorSchedule(d.schedules)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedDoctor && (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Select Date</Form.Label>
              <Form.Control type="date" value={selectedDate} onChange={handleDateChange} />
            </Form.Group>

            {availableTimes.length > 0 && (
              <Form.Group className="mb-2">
                <Form.Label>Select Time</Form.Label>
                <Form.Select value={selectedTime} onChange={handleTimeChange}>
                  <option value="">-- Select Time --</option>
                  {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
                </Form.Select>
              </Form.Group>
            )}

            <Button variant="success" onClick={handleBook} disabled={availableTimes.length === 0}>
              Book Appointment
            </Button>
            {availableTimes.length === 0 && <p className="text-danger mt-2">No available slots for the selected date</p>}
          </>
        )}
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={modalContent.onConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
