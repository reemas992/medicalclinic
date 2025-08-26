// components/DoctorCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";

export default function DoctorCard({ doctor, onBook }) {
  return (
    <Card className="shadow-sm mb-3">
      {/* صورة الطبيب */}
      {doctor.image ? (
        <Card.Img 
          variant="top" 
          src={doctor.image} 
          alt={doctor.user?.name} 
          style={{ height: '200px', objectFit: 'contain' }}
        />
      ) : (
        <div style={{ height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          No Image
        </div>
      )}

      <Card.Body>
        <Card.Title>{doctor.user?.name || "Unknown Doctor"}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {doctor.specialty || "Specialty N/A"}
        </Card.Subtitle>
        <Card.Text>
          <strong>Experience:</strong> {doctor.experience_years || 0} years
        </Card.Text>

      
      </Card.Body>
    </Card>
  );
}
