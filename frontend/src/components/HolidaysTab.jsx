import { useEffect, useState } from "react";
import { getHolidays, addHoliday } from "../api/holidays";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";
import api from "../api/axios";

const HolidaysTab = () => {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ date: "", reason: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date) return alert("Please select a date");
    await addHoliday(form);
    setForm({ date: "", reason: "" });
    fetchHolidays();
  };

  const handleEditClick = (holiday) => {
    setSelectedHoliday({ ...holiday });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/holiday/${selectedHoliday.id}`, selectedHoliday);
      setShowEditModal(false);
      fetchHolidays();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (holiday) => {
    setHolidayToDelete(holiday);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/holiday/${holidayToDelete.id}`);
      setShowDeleteModal(false);
      setHolidayToDelete(null);
      fetchHolidays();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Holidays</h3>

      <Form onSubmit={handleAdd} className="mb-3">
        <Row className="align-items-center">
          <Col xs={4}>
            <Form.Control
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Col>
          <Col xs={4}>
            <Form.Control
              type="text"
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </Col>
          <Col xs={4}>
            <Button type="submit" variant="primary">
              Add Holiday
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Reason</th>
            <th style={{ minWidth: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.reason}</td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="warning" onClick={() => handleEditClick(h)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteClick(h)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Holiday Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHoliday && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedHoliday.date}
                  onChange={(e) =>
                    setSelectedHoliday({ ...selectedHoliday, date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedHoliday.reason}
                  onChange={(e) =>
                    setSelectedHoliday({ ...selectedHoliday, reason: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this holiday{holidayToDelete?.date}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HolidaysTab;
