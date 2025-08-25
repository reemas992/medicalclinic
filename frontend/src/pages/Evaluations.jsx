import { useState, useEffect } from "react";
import { addEvaluation, getAllEvaluations, updateEvaluation, deleteEvaluation } from "../api/evaluations";
import { Container, Form, Button, Card } from "react-bootstrap";

const EvaluationPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchEvaluations = async () => {
    try {
      const res = await getAllEvaluations();
      setEvaluations(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch evaluations:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvaluation(editingId, { rating, comment });
        setEditingId(null);
      } else {
        await addEvaluation({ rating, comment });
      }
      setComment("");
      setRating(0);
      fetchEvaluations();
    } catch (err) {
      console.error("❌ Failed to submit evaluation:", err);
    }
  };

  const handleEdit = (ev) => {
    setEditingId(ev.id);
    setRating(ev.rating);
    setComment(ev.comment);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvaluation(id);
      fetchEvaluations();
    } catch (err) {
      console.error("❌ Failed to delete evaluation:", err);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Clinic Evaluations</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value="">Choose rating...</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback about the clinic..."
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          {editingId ? "Update Evaluation" : "Send Evaluation"}
        </Button>
        {editingId && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setEditingId(null);
              setRating(0);
              setComment("");
            }}
          >
            Cancel
          </Button>
        )}
      </Form>

      {evaluations.length === 0 ? (
        <p>No evaluations yet.</p>
      ) : (
        evaluations.map((ev) => (
          <Card key={ev.id} className="mb-3">
            <Card.Body>
              <Card.Title>{ev.rating} ⭐</Card.Title>
              <Card.Text>{ev.comment}</Card.Text>
              <small className="text-muted">
                by: {ev.user?.name || "Unknown"}
              </small>
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleEdit(ev)}
                >
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(ev.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default EvaluationPage;
