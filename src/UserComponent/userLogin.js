import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  email: yup.string().email().required("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is Rquired")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function UserLogin() {
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
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          setLoading(true);
          await localStorage.removeItem("userId");
          await localStorage.removeItem("userToken");
          const response = await fetch("https://crm-4myq.onrender.com/user/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (
            result.success == false &&
            result.message ==
              "Please Verify The Email. Verification Link Send To Your Mail Successfully"
          ) {
            handleClickOpen();
          }
          if (result.success == true) {
            localStorage.setItem("userToken", result.token);
            localStorage.setItem("userId", result.id);
            navigate("/user/dashboard");
          } else {
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
            onClick={() => navigate("/employee/login")}
            variant="primary"
            type="submit"
          >
            ADMIN SIGN IN
          </Button>
        </span>
      </div>
      <Row className="justify-content-around align-items-center">
        <Col md={4}>
          <img className="img-fluid" src="/crm.webp"></img>
        </Col>

        <Col md={4}>
          <h3 style={{ fontWeight: "350" }}>Sign in</h3>
          <h6 style={{ fontWeight: "350" }}>to access CRM</h6>

          <Form onSubmit={handleSubmit} className="pt-3">
            <Form.Group className="pb-2" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={values.email}
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
              Next
            </Button>
          </Form>
          <p className="text-center mt-2">
            Forgot <Link to={"/user/forget/password"}>password?</Link>
          </p>
          <div className="text-center">
            Not registered yet? <Link to={"/user/signup"}>Sign Up</Link>
          </div>
          <div className="demo">
            <p className="m-0">For Demo:</p>
            <p className="m-0">Email: ravi@gmail.com</p>
            <p className="m-0">password: user@123</p>
          </div>
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
