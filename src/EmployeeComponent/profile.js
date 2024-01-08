import React, { useEffect, useState } from "react";
import UserBaseApp from "../BaseApp/userBaseApp";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import { AppState } from "../Context/AppProvider";
import AdminBaseApp from "../BaseApp/adminBaseApp";

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { employee, setEmployee } = AppState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const employeeId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const employeeData = employee.data.find((data) => {
    return data._id == employeeId;
  });

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const update = async () => {
    try {
      const data = {
        firstName,
        lastName,
        role: employeeData.role,
      };
      const response = await fetch(
        `https://crm-4myq.onrender.com/employee/update/${employeeId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      navigate("/employee/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (employee !== null) {
      if (
        employee.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [employee]);

  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Edit Profile</h4>
        </div>
      </div>
      {employeeData && (
        <Container className="mt-5">
          <Row>
            <Col className="pb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                defaultValue={employeeData.firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </Col>
            <Col className="pb-2">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                defaultValue={employeeData.lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </Col>
          </Row>
          <Form.Group className="pb-2 pt-2" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              disabled
              type="email"
              defaultValue={employeeData.email}
              placeholder="Enter email"
            />
          </Form.Group>

          <div className=" d-flex justify-content-end mt-4 mb-4">
            <Button className="w-100" onClick={() => update()}>
              Update
            </Button>
          </div>
        </Container>
      )}
    </AdminBaseApp>
  );
}
