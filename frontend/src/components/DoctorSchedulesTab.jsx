import { useEffect, useState } from "react";
import { getAllSchedules, createSchedule, deleteSchedule } from "../api/doctorSchedules";
import { getDoctors } from "../api/doctors";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

const DoctorSchedulesTab = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: "", dayOfWeek: "", startTime: "", endTime: "", breaks: "" });

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
  }, []);

  const fetchSchedules = async () => {
    const data = await getAllSchedules();
    setSchedules(data);
  };

  const fetchDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dayOfWeek: parseInt(form.dayOfWeek),
      breaks: form.breaks ? JSON.parse(form.breaks) : []
    };
    await createSchedule(payload);
    fetchSchedules();
  };

  const handleDelete = async (id) => {
    await deleteSchedule(id);
    fetchSchedules();
  };

  return (
    <div>
      <h3>Doctor Schedules</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.user?.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>
              <option value="">Day</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Control type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          </Col>
          <Col>
            <Form.Control type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder='[{"start":"12:00:00","end":"13:00:00"}]'
              value={form.breaks}
              onChange={(e) => setForm({ ...form, breaks: e.target.value })}
            />
          </Col>
          <Col>
            <Button type="submit">Add</Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Breaks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.doctor?.user?.name}</td>
              <td>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][s.dayOfWeek]}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{JSON.stringify(s.breaks)}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorSchedulesTab;
