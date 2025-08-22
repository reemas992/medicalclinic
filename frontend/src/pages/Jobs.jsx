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
      <h2 className="mb-4">Job Opportunities</h2>
      {jobs.map((job) => (
        <Card className="mb-3" key={job.id}>
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Text>{job.description}</Card.Text>
            <Card.Subtitle className="text-muted">
              Location: {job.location} | Posted: {new Date(job.createdAt).toLocaleDateString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
