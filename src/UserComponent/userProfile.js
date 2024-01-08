import React, { useEffect, useState } from "react";
import UserBaseApp from "../BaseApp/userBaseApp";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Container } from "react-bootstrap";
import { AppState } from "../Context/AppProvider";

export default function UserProfile() {
  const navigate = useNavigate();

  const { user } = AppState();
  const [firstName, setFirstName] = useState(user.data.firstName);
  const [lastName, setLastName] = useState(user.data.lastName);
  const [companyName, setCompanyName] = useState(user.data.companyName);
  const [contactNumber, setContactNumber] = useState(user.data.contactNumber);
  const [address, setAddress] = useState(user.data.address);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };

  const update = async () => {
    try {
      const data = {
        firstName,
        lastName,
        companyName,
        contactNumber,
        address,
      };
      const response = await fetch(
        `https://crm-4myq.onrender.com/user/update/${userId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      navigate("/user/dashboard  ");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user]);

  return (
    <UserBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Edit Profile</h4>
        </div>
      </div>
      <Container>
        <Row>
          <Col className="pb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </Col>
          <Col className="pb-2">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              defaultValue={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            defaultValue={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
        </Form.Group>
        <Form.Group className="pb-2" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            disabled
            type="email"
            defaultValue={user.data.email}
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control
            defaultValue={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </Form.Group>

        <Form.Label>Contact No.</Form.Label>
        <InputGroup className="mb-4">
          <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
          <Form.Control
            placeholder="Phone"
            onChange={(e) => setContactNumber(e.target.value)}
            defaultValue={user.data.contactNumber}
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <div className=" d-flex justify-content-end mb-4">
          <Button className="w-100" onClick={() => update()}>
            Update
          </Button>
        </div>
      </Container>
    </UserBaseApp>
  );
}
