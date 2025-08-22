import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function ToastMessage({ show, onClose, message, bg = "success" }) {
  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast show={show} onClose={onClose} bg={bg} delay={3000} autohide>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
