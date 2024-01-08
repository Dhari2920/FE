import React, { useEffect, useRef, useState } from "react";
import UserBaseApp from "../BaseApp/userBaseApp";
import * as yup from "yup";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AppState } from "../Context/AppProvider";
import { Button } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const serviceRequestValidationSchema = yup.object().shape({
  serviceRequest: yup
    .array()
    .required()
    .min(1, "At least one of them should be selected"),
  description: yup
    .string()
    .required("Description is Required")
    .min(15, "Minimum 15 characters required"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function RequestQuote() {
  const [loading, setLoading] = useState(false);
  const { service, setService } = AppState();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };

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

  const ref = useRef([]);

  const Unchecked = () => {
    for (let i = 0; i < ref.current.length; i++) {
      ref.current[i].checked = false;
    }
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        serviceRequest: [],
        description: "",
      },
      validationSchema: serviceRequestValidationSchema,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://crm-4myq.onrender.com/quote/servicerequest/${userId}`,
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
            Unchecked();
            resetForm({ values: "" });
            setLoading(false);
            handleClick();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

  useEffect(() => {
    if (service !== null) {
      if (
        service.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [service]);

  return (
    <UserBaseApp>
       {loading ? (
        <Box sx={{ width: "100vw" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Request A Quote</h4>
        </div>
      </div>
      <Container>
        <div className="service-title">
          <h5 style={{ fontWeight: "200" }} className="mb-3 mt-3">
            Please click mention services of your interest to receieve quotation
            for the same:
          </h5>
        </div>
        {service && (
          <form onSubmit={handleSubmit}>
            <div className="">
              <Row className="">
                {service.data.map((data, index) => {
                  return (
                    <Col md={5} lg={3} key={index} className="pb-3">
                      <input
                        ref={(element) => {
                          ref.current[index] = element;
                        }}
                        type="checkbox"
                        id={data}
                        name="serviceRequest"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={data}
                      ></input>{" "}
                      <label for="Website">{data}</label>
                    </Col>
                  );
                })}
                {touched.serviceRequest && errors.serviceRequest ? (
                  <p style={{ color: "crimson" }}>{errors.serviceRequest}</p>
                ) : (
                  ""
                )}

                <Col lg={12} className="mt-3">
                  <Form.Control
                    name="description"
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    as="textarea"
                    placeholder="Query"
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
            </div>
          </form>
        )}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Quote Request Send Successfully
          </Alert>
        </Snackbar>
      </Container>
    </UserBaseApp>
  );
}
