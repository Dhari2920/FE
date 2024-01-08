import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppState } from "../Context/AppProvider";
import UserBaseApp from "../BaseApp/userBaseApp";
import { Col, Container, Row } from "react-bootstrap";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";

export default function UserDashboard() {
  const {
    user,
    setUser,
    quote,
    setQuote,
    ticket,
    setTicket,
    employee,
    setEmployee,
    service,
    setService,
  } = AppState();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      logout();
    } else {
      const getData = async (req, res) => {
        try {
          const id = localStorage.getItem("userId");
          const token = localStorage.getItem("userToken");
          const response = await fetch(
            `https://crm-4myq.onrender.com/user/data/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const UserData = await response.json();
          setUser(UserData);
          const response2 = await fetch(
            `https://crm-4myq.onrender.com/quote/data/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const quoteData = await response2.json();
          setQuote(quoteData);
          const response3 = await fetch(
            `https://crm-4myq.onrender.com/ticket/data/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const ticketData = await response3.json();
          setTicket(ticketData);
          const response4 = await fetch(`https://crm-4myq.onrender.com/employee/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const employeeData = await response4.json();
          setEmployee(employeeData);
          const response5 = await fetch(`https://crm-4myq.onrender.com/service/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serviceData = await response5.json();
          setService(serviceData);

          if (UserData.success == false) {
            logout();
          }
          if (quoteData.success == false) {
            logout();
          }
          if (ticketData.success == false) {
            logout();
          }
          if (employeeData.success == false) {
            logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (quote !== null) {
      if (
        quote.message ==
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
    if (employee !== null) {
      if (
        employee.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (service !== null) {
      if (
        service.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user, quote, ticket, employee, service]);
  return (
    <UserBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Dashboard</h4>
        </div>
      </div>
      {user && (
        <div>
          <h2 className="text-center mt-4">Welcome {user.data.firstName}</h2>
        </div>
      )}
      {user && (
        <Container>
          <Row className="justify-content-around gap-4 mt-5">
            <Col
              md={2}
              style={{ backgroundColor: "#F1C27B" }}
              onClick={() => navigate("/ticket/manage")}
              className="dashboard pointer"
            >
              <div className="p-3">
                <h5 className="text-center">
                  <ConfirmationNumberIcon /> View Ticket
                </h5>
              </div>
            </Col>
            <Col
              md={2}
              className="dashboard pointer"
              onClick={() => navigate("/user/servicerequest")}
            >
              <div className="p-3">
                <h5 className="text-center">
                  <PaymentIcon /> Get Quote
                </h5>
              </div>
            </Col>
            <Col
              md={2}
              style={{ backgroundColor: "#85A389" }}
              onClick={() => navigate("/user/profile")}
              className="dashboard pointer"
            >
              <div className="p-3">
                <h5 className="text-center">
                  <PersonIcon /> My Profile
                </h5>
              </div>
            </Col>
            <Col
              md={2}
              style={{ backgroundColor: "#FFD89C" }}
              onClick={() => navigate("/ticket/create")}
              className="dashboard pointer"
            >
              <div className="p-3">
                <h5 className="text-center">
                  <ConfirmationNumberIcon /> Create
                </h5>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </UserBaseApp>
  );
}
