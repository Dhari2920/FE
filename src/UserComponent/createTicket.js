import React, { useState } from "react";
import UserBaseApp from "../BaseApp/userBaseApp";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const ticketSchemaValidation = yup.object({
  subject: yup
    .string()
    .required("Subject is required")
    .min(5, "Description should be minimum 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(15, "Description should be minimum 15 characters"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateTicket() {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        subject: "",
        description: "",
      },
      validationSchema: ticketSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://crm-4myq.onrender.com/ticket/create/${userId}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          resetForm({ values: "" });
          setLoading(false);
          handleClick();
        } catch (error) {
          console.log(error);
        }
      },
    });

  return (
    <UserBaseApp>
      {loading ? (
        <Box sx={{ width: "100vw" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <form onSubmit={handleSubmit}>
        <div className="service-list-header">
          <div className="sevice-title">
            <h4>Create Ticket</h4>
          </div>
        </div>
        <Container>
          <Row className="mt-5 justify-content-center createTicket">
            <Form.Label column lg={2}>
              Subject
            </Form.Label>
            <Col lg={6}>
              <Form.Control
                value={values.subject}
                name="subject"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                placeholder="Subject"
              />
              {touched.subject && errors.subject ? (
                <p style={{ color: "crimson" }}>{errors.subject}</p>
              ) : (
                ""
              )}
            </Col>
          </Row>

          <Row className="mt-4 justify-content-center createTicket">
            <Form.Label column lg={2}>
              Description
            </Form.Label>
            <Col lg={6}>
              <Form.Control
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                as="textarea"
                placeholder="Description"
                rows={3}
              />
              {touched.description && errors.description ? (
                <p style={{ color: "crimson" }}>{errors.description}</p>
              ) : (
                ""
              )}
              <div className="d-flex justify-content-end mt-3">
                <Button className="ticket-send-btn" type="submit">
                  Send
                </Button>
              </div>
            </Col>
          </Row>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Ticket Created Successfully
            </Alert>
          </Snackbar>
        </Container>
      </form>
    </UserBaseApp>
  );
}
