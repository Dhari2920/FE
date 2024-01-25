import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import InputGroup from "react-bootstrap/InputGroup";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const userSchemaValidation = yup.object({
  firstName: yup
    .string()
    .required("First Name Required")
    .min(3, "Must be 3 characters or more"),
  lastName: yup
    .string()
    .required("Last Name Required")
    .min(3, "Must be 3 characters or more"),
  email: yup.string().email().required("Please enter a valid email address"),
  companyName: yup
    .string()
    .required("Please Enter Company Name")
    .min(5, "Must be 5 characters or more"),
  contactNumber: yup
    .string()
    .length(10, "Contact Number must be 10 Number")
    .required("Contact Number Required"),
  password: yup
    .string()
    .required("Password is Rquired")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function UserSignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        contactNumber: "",
        companyName: "",
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true);
          const response = await fetch("https://crm-4myq.onrender.com/user/signup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            handleClickOpen();
          }
          
          if (result.success == false) {
            toast.error(result.message);
          }
          if (result.success == true) {
            resetForm();
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
          <h1 style={{ fontWeight: "350" }}>ZEN CLASS</h1>
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
            Get started for free
          </h3>

          <Form onSubmit={handleSubmit} className="pt-3">
            <Row>
              <Col className="pb-2">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  placeholder="First name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.firstName && errors.firstName ? (
                  <p style={{ color: "crimson" }}>{errors.firstName}</p>
                ) : (
                  ""
                )}
              </Col>

              <Col className="pb-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  placeholder="Last name"
                  name="lastName"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.lastName && errors.lastName ? (
                  <p style={{ color: "crimson" }}>{errors.lastName}</p>
                ) : (
                  ""
                )}
              </Col>
            </Row>
            <Form.Group className="pb-2" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
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
                type="password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>
            {touched.password && errors.password ? (
              <p style={{ color: "crimson" }}>{errors.password}</p>
            ) : (
              ""
            )}
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                placeholder="Address"
                name="companyName"
                value={values.companyName}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Group>
            {touched.companyName && errors.companyName ? (
              <p style={{ color: "crimson" }}>{errors.companyName}</p>
            ) : (
              ""
            )}
            <Form.Label>Contact No.</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
              <Form.Control
                placeholder="Phone"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={values.contactNumber}
                type="number"
                name="contactNumber"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </InputGroup>
            {touched.contactNumber && errors.contactNumber ? (
              <p style={{ color: "crimson" }}>{errors.contactNumber}</p>
            ) : (
              ""
            )}

            <Button className="w-100" variant="primary" type="submit">
              GET STARTED
            </Button>
          </Form>
        </Col>
      </Row>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"A verification link has send to your email account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please click on the link that has just been sent to your email
            account to verify your email and continue the registration process.
            {"Note :"} Link valid for 15 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
