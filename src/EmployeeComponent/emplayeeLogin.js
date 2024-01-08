import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const userSchemaValidation = yup.object({
  email: yup.string().email().required("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is Rquired")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          setLoading(true);
          await localStorage.removeItem("id");
          await localStorage.removeItem("token"); 
          const response = await fetch("https://crm-4myq.onrender.com/employee/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("id", result.id);
            navigate("/employee/dashboard");
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setLoading(false);
        }
      },
    });

  return (
    <Container fluid className="login">
      {loading ? (
        <Box sx={{ width: "100vw" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <div className="d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <h1 style={{ fontWeight: "350" }}>CRM</h1>
        </span>
        <span className="d-flex align-items-center">
          <Button
            onClick={() => navigate("/user/login")}
            variant="primary"
            type="submit"
          >
            USER SIGN IN
          </Button>
        </span>
      </div>
      <Row className="justify-content-around align-items-center">
        <Col md={4}>
          <img className="img-fluid" src="/crm.webp"></img>
        </Col>
        <Col md={4}>
          <h3
            style={{ fontWeight: "350" }}
            className="Auth-form-title text-center"
          >
            Employee Sign in
          </h3>

          <Form onSubmit={handleSubmit} className="pt-3">
            <Form.Group className="pb-2" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            {touched.email && errors.email ? (
              <p style={{ color: "crimson" }}>{errors.email}</p>
            ) : (
              ""
            )}
            <Form.Group className="pb-2" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            {touched.password && errors.password ? (
              <p style={{ color: "crimson" }}>{errors.password}</p>
            ) : (
              ""
            )}
            <Button className="w-100" variant="primary" type="submit">
              Next
            </Button>
          </Form>
          <div className="demo mt-3"> 
            <p className="m-0">For Demo:</p>
            <p className="m-0">Email: suriya@gmail.com</p>
            <p className="m-0">password: admin@123</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
