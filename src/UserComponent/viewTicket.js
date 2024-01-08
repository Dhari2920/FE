import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserBaseApp from "../BaseApp/userBaseApp";
import { AppState } from "../Context/AppProvider";
import Badge from "react-bootstrap/Badge";
import { useFormik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";

const ticketSchemaValidation = yup.object({
  description: yup
    .string()
    .required("Description is Required")
    .min(15, "Minimum 15 characters required"),
});
export default function ViewTicket() {
  const { user, setUser, ticket, setTicket, employee } = AppState();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");

  const ticketData = ticket.data.find((data) => {
    return data._id == id;
  });

  const employeeData = employee.data.find((data) => {
    return data._id == ticketData.employeeId;
  });

  const getUpdate = async () => {
    const response = await fetch(
      `https://crm-4myq.onrender.com/ticket/data/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const ticketData = await response.json();
    setTicket(ticketData);
    if (ticketData.success == false) {
      logout();
    }
  };
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        description: "",
      },
      validationSchema: ticketSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          const response = await fetch(
            `https://crm-4myq.onrender.com/ticket/update/${userId}/${id}`,
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
    if (ticket !== null) {
      if (
        ticket.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
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
  }, [ticket, user, employee]);
  return (
    <UserBaseApp>
      <form onSubmit={handleSubmit}>
        <div className="service-list-header">
          <div className="sevice-title">
            <h4>Ticket Support</h4>
          </div>
          <div className="sevice-title">
            <CloseButton
              variant="white"
              onClick={() => navigate("/ticket/manage")}
              className="create-btn pr-5"
            />
          </div>
        </div>

        {ticketData != null && (
          <Container>
            <Row>
              <Col className="support-containner">
                <div className="mt-4">
                  <h4>{ticketData.subject}</h4>
                  <p>
                    Created On{" "}
                    {new Date(ticketData.createdAt).toLocaleString().split(",")}{" "}
                    <Badge bg="danger">{ticketData.status}</Badge>
                  </p>
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
                          ? "justify-content-end"
                          : "justify-content-start"
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
                                ? user.data.firstName
                                : employeeData.firstName}
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
    </UserBaseApp>
  );
}
