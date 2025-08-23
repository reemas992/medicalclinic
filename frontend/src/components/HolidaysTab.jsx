import { useEffect, useState } from "react";
import { getHolidays, addHoliday } from "../api/holidays";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

const HolidaysTab = () => {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ date: "", reason: "" });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHoliday(form);
    setForm({ date: "", reason: "" });
    fetchHolidays();
  };

  return (
    <div>
      <h3>Holidays</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
            <th>Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.reason}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default HolidaysTab;
