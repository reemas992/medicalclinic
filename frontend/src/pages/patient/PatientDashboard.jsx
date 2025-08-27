import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAppointmentsByPatient, bookAppointment, cancelAppointment } from '../../api/appointments';
import { getDoctors } from '../../api/doctors';
import moment from 'moment';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [patientId] = useState(19); // يمكن جلبه من JWT لاحقًا

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsByPatient(patientId);
      setAppointments(data);
    } catch (err) {
      toast.error("Failed to load appointments");
    }
  };

  const fetchDoctors = async () => {
    try {
      setDoctors(await getDoctors());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoctorChange = (id) => {
    const doc = doctors.find(d => d.id === parseInt(id));
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
      toast.info("Doctor is not available on this day");
      return;
    }

    let times = [];
    let start = moment(schedule.startTime, "HH:mm:ss");
    const end = moment(schedule.endTime, "HH:mm:ss");

    while (start.isBefore(end) && times.length < 8) {
      const t = start.format("HH:mm");
      const inBreak = schedule.breaks?.some(b => {
        const bStart = moment(b.start, "HH:mm:ss");
        const bEnd = moment(b.end, "HH:mm:ss");
        return start.isBetween(bStart, bEnd, null, "[)");
      });
      if (!inBreak) times.push(t);
      start.add(1, "hours");
    }

    const booked = appointments
      .filter(a => a.doctorId === selectedDoctor.id && moment(a.date).format('YYYY-MM-DD') === date)
      .map(a => moment(a.date).format('HH:mm'));

    setAvailableTimes(times.filter(t => !booked.includes(t)));
  };

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.warning("Select all fields");
      return;
    }
    try {
      const datetime = moment(`${selectedDate} ${selectedTime}`, "YYYY-MM-DD HH:mm").toISOString();
      await bookAppointment({ doctorId: selectedDoctor.id, date: datetime });
      toast.success("Appointment booked!");
      fetchAppointments();
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimes([]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.info("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  return (
    <Container className="py-5">
      <h2>My Appointments</h2>
      <Table striped bordered hover>
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
                {a.status === "scheduled" && <Button size="sm" onClick={() => handleCancel(a.id)}>Cancel</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Book Appointment</h2>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Doctor</Form.Label>
          <Form.Select onChange={e => handleDoctorChange(e.target.value)}>
            <option value="">--Select--</option>
            {doctors.map(d =>
              <option key={d.id} value={d.id}>
                {d.user.name} ({d.specialty})
              </option>
            )}
          </Form.Select>
        </Form.Group>

        {selectedDoctor && <>
          <Form.Group className="mb-2">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={selectedDate} onChange={handleDateChange} />
          </Form.Group>

          {availableTimes.length > 0 ? (
            <Form.Group className="mb-2">
              <Form.Label>Time</Form.Label>
              <Form.Select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                <option value="">--Select--</option>
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </Form.Select>
            </Form.Group>
          ) : (
            selectedDate && <p className="text-danger">Doctor is not available on this day</p>
          )}

          <Button onClick={handleBook} disabled={availableTimes.length === 0}>Book Appointment</Button>
        </>}
      </Form>
    </Container>
  );
}
