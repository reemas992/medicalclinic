import { Card, Button } from "react-bootstrap";

const AppointmentCard = ({ appointment, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{appointment.doctorName}</Card.Title>
        <Card.Text>
          Date: {appointment.date} <br/>
          Time: {appointment.time} <br/>
          Notes: {appointment.notes}
        </Card.Text>
        {onDelete && <Button variant="danger" onClick={onDelete}>Cancel</Button>}
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;
