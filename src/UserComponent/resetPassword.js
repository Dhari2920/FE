import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const userSchemaValidation = yup.object({
  password: yup
    .string()
    .required("Password is Rquired")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id, token } = useParams();

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://crm-4myq.onrender.com/user/reset-password/${id}/${token}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (result.success == true) {
            toast.success(result.message);
            navigate("/user/login");
          }
          if (result.success == false) {
            toast.error(result.message);
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
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
          <h3 style={{ fontWeight: "350" }}>Reset</h3>
          <h6 style={{ fontWeight: "350" }}>Your Password</h6>

          <Form onSubmit={handleSubmit} className="pt-3">
            <Form.Group className="pb-2" controlId="formGroupPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                value={values.password}
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
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
