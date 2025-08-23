import React, { useContext } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import "../styles/AppNavbar.css"; // custom styles

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" className="shadow-sm">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="Medical Clinic" width="40" className="me-2" />
          Medical Clinic
        </Navbar.Brand>

        {/* Links */}
        <div className="d-flex align-items-center gap-3">
          <Button as={Link} to="/" variant="link" className="nav-btn">
            Home
          </Button>
          <Button as={Link} to="/doctors" variant="link" className="nav-btn">
            Doctors
          </Button>
          <Button as={Link} to="/jobs" variant="link" className="nav-btn">
            Jobs
          </Button>
          <Button as={Link} to="/contact" variant="link" className="nav-btn">
            Contact
          </Button>

          {/* New Services Button */}
          <Button as={Link} to="/services" variant="link" className="nav-btn">
            Services
          </Button>
        </div>

        {/* User Section */}
        <div className="d-flex align-items-center gap-3">
          {!user ? (
            <>
              <Button as={Link} to="/login" variant="link" className="nav-btn">
                Login
              </Button>
              <Button as={Link} to="/register" variant="link" className="nav-btn">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "doctor"
                    ? "/doctor"
                    : "/patient"
                }
                variant="link"
                className="nav-btn"
              >
                Dashboard
              </Button>

              <Button
                size="sm"
                variant="link"
                className="nav-btn text-danger"
                onClick={handleLogout}
              >
                Logout
              </Button>

              <span className="fw-bold text-primary">
                Welcome {user.username} ({user.role})
              </span>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
