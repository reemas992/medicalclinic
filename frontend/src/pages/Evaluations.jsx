import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

import { getMyEvaluations } from "../api/evaluations";

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await getMyEvaluations();
        setEvaluations(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvaluations();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Patient Evaluations</h2>
      {evaluations.map((ev) => (
        <Card className="mb-3" key={ev.id}>
          <Card.Body>
            <Card.Title>{ev.doctor?.user?.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Patient: {ev.patient?.name}
            </Card.Subtitle>
            <Card.Text>
              <strong>Rating:</strong> {ev.rating} / 5
            </Card.Text>
            <Card.Text>{ev.comment}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
