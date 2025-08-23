import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { getJobs } from "../api/jobs";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        setJobs(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center text-primary">Job Opportunities</h2>
      {jobs.map((job) => (
        <Card className="mb-3 border-0 shadow-sm" key={job.id}>
          <Card.Body className="text-center">
            <Card.Title className="text-secondary">{job.title}</Card.Title>
            <Card.Text className="text-muted">{job.description}</Card.Text>
            <Card.Subtitle className="text-muted">
              Location: {job.location} | Posted: {new Date(job.createdAt).toLocaleDateString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      ))}

      {/* Additional Contact Text */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body className="text-center text-info">
          <Card.Text>
            We look forward to a personal conversation and would greatly appreciate
            the electronic submission of your application documents in advance to{" "}
            <a href="mailto:info@medicalclinic.com" className="text-decoration-none text-dark">
              info@medicalclinic.com
            </a>.
            <br />
            Thank you very much for your interest.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
