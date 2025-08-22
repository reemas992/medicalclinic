import React from "react";
import { Alert } from "react-bootstrap";

export default function AlertBanner({ message, variant = "info" }) {
  if (!message) return null;
  return <Alert variant={variant}>{message}</Alert>;
}
