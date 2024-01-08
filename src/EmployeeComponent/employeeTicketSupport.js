import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import Badge from "react-bootstrap/Badge";
import { CloseButton, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppState } from "../Context/AppProvider";
import { useFormik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

const ticketSchemaValidation = yup.object({
  status: yup.string().required("Status Required"),
  description: yup
    .string()
    .required("Description is Rquired")
    .min(15, "Minimum 15 characters required"),
});

export default function EmployeeTicketSupport() {
  const {
    user,
    setUser,
    employee,
    setEmployee,
    ticket,
    setTicket,
    employeeTicket,
    setEmployeeTicket,
  } = AppState();
  const { id } = useParams();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };
  const employeeId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const ticketData = employeeTicket.data.find((data) => {
    return data._id == id;
  });
  const userData = user.data.find((data) => {
    return data._id == ticketData.userId;
  });
  const empoyeeData = employee.data.find((data) => {
    return data._id == employeeId;
  });

  const getUpdate = async () => {
    const response = await fetch(
      `https://crm-4myq.onrender.com/ticket/data/employee/${employeeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const employeeTicketData = await response.json();
    setEmployeeTicket(employeeTicketData);
    if (employeeTicketData.success == false) {
      logout();
    }
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        status: ticketData.status,
        description: "",
      },
      validationSchema: ticketSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          const response = await fetch(
            `https://crm-4myq.onrender.com/ticket/update/${employeeId}/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          getUpdate();
          resetForm({ values: "" });
        } catch (error) {
          console.log(error);
        }
      },
    });

  useEffect(() => {
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (employee !== null) {
      if (
        employee.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (ticket !== null) {
      if (
        ticket.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user, employee, ticket]);

  return (
    <AdminBaseApp>
      <form onSubmit={handleSubmit}>
        <div className="service-list-header">
          <div className="sevice-title">
            <h4>Support</h4>
          </div>
          <div className="sevice-title">
            <CloseButton
              variant="white"
              onClick={() => navigate("/ticket/employee/manage")}
              className="create-btn pr-5"
            />
          </div>
        </div>
        {ticketData !== null && (
          <Container>
            <Row>
              <Col className="support-containner">
                <div className="mt-4">
                  <div className="d-flex justify-content-between">
                    <h4>{ticketData.subject}</h4>
                    {ticketData.status == "Closed" ? (
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl disabled fullWidth>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            Status
                          </InputLabel>
                          <NativeSelect
                            defaultValue={values.status}
                            onChange={handleChange}
                            inputProps={{
                              name: "status",
                              id: "uncontrolled-native",
                            }}
                          >
                            <option value={"Open"}>Open</option>
                            <option value={"Closed"}>Closed</option>
                          </NativeSelect>
                        </FormControl>
                      </Box>
                    ) : (
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            Status
                          </InputLabel>
                          <NativeSelect
                            defaultValue={values.status}
                            onChange={handleChange}
                            inputProps={{
                              name: "status",
                              id: "uncontrolled-native",
                            }}
                          >
                            <option value={"Open"}>Open</option>
                            <option value={"Closed"}>Closed</option>
                          </NativeSelect>
                        </FormControl>
                      </Box>
                    )}
                  </div>

                  <p>
                    Created On{" "}
                    {new Date(ticketData.createdAt).toLocaleString().split(",")}{" "}
                    <Badge bg="danger">{ticketData.status}</Badge>
                  </p>
                  {ticketData.status == "Closed" ? (
                    <p>
                      Closed On{" "}
                      {new Date(ticketData.closedAt)
                        .toLocaleString()
                        .split(",")}
                    </p>
                  ) : (
                    " "
                  )}
                  <p style={{ margin: "0px", fontWeight: "600" }}>
                    Description:
                  </p>

                  <p>{ticketData.description}</p>
                </div>
              </Col>
            </Row>

            {ticketData.remark.length !== 0
              ? ticketData.remark.map((data, index) => {
                  return (
                    <Row
                      key={index}
                      className={
                        data.role == "User"
                          ? "justify-content-start"
                          : "justify-content-end"
                      }
                    >
                      <Col sm={6} md={6} lg={3}>
                        <div className="message">
                          <div className="d-flex gap-3">
                            <p
                              style={{
                                color: "#555a8f",
                                paddingLeft: "10px",
                                fontWeight: "600",
                              }}
                              className=""
                            >
                              {data.role == "User"
                                ? userData.firstName
                                : empoyeeData.firstName}
                            </p>
                            <p>
                              {data.createdAt.split(" ").slice(0, 4).join(" ")}
                            </p>
                          </div>
                          <p style={{ padding: "0 0 10px 10px" }}>
                            {data.description}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  );
                })
              : ""}

            {ticketData.status == "Closed" ? (
              " "
            ) : (
              <Row className="mt-4 justify-content-center createTicket">
                <Col lg={12}>
                  <Form.Control
                    name="description"
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    as="textarea"
                    placeholder="Remark"
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
            )}
          </Container>
        )}
      </form>
    </AdminBaseApp>
  );
}
