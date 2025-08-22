import React from "react";
import { Card, Button } from "react-bootstrap";

export default function DoctorCard({ doctor, onBook }) {
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>{doctor.user?.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {doctor.specialty}
        </Card.Subtitle>
        <Card.Text>
          <strong>Experience:</strong> {doctor.experience_years} years
        </Card.Text>
        {onBook && (
          <Button variant="primary" onClick={() => onBook(doctor.id)}>
            Book Appointment
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
