import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppState } from "../Context/AppProvider";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import { Col, Container, Row } from "react-bootstrap";

export default function EmployeeDashboard() {
  const {
    user,
    setUser,
    quote,
    setQuote,
    service,
    setService,
    employee,
    setEmployee,
    ticket,
    setTicket,
    employeeTicket,
    setEmployeeTicket,
    employeeQuote,
    setEmployeeQuote,
    profile,
    setProfile
  } = AppState();
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("id");
  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      logout();
    } else {
      const getData = async (req, res) => {
        try {
          const id = localStorage.getItem("id");
          const token = localStorage.getItem("token");
          const response = await fetch(`https://crm-4myq.onrender.com/user/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await response.json();
          setUser(userData);
          const response2 = await fetch(`https://crm-4myq.onrender.com/service/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serviceData = await response2.json();
          setService(serviceData);
          const response3 = await fetch(`https://crm-4myq.onrender.com/quote/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const quoteData = await response3.json();
          setQuote(quoteData);
          const response4 = await fetch(`https://crm-4myq.onrender.com/employee/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const employeeData = await response4.json();
          setEmployee(employeeData);
          const responseProfile = await fetch(`https://crm-4myq.onrender.com/employee/data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const employeeProfile = await responseProfile.json();
          setProfile(employeeProfile);
          const response5 = await fetch(`https://crm-4myq.onrender.com/ticket/data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const ticketData = await response5.json();
          setTicket(ticketData);
          const response6 = await fetch(
            `https://crm-4myq.onrender.com/ticket/data/employee/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const employeeTicketData = await response6.json();
          setEmployeeTicket(employeeTicketData);
          const response7 = await fetch(
            `https://crm-4myq.onrender.com/quote/data/employee/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const quoteEmployeeData = await response7.json();
          setEmployeeQuote(quoteEmployeeData);
          if (userData.success == false) {
            logout();
          }
          if (serviceData.success == false) {
            logout();
          }
          if (quoteData.success == false) {
            logout();
          }
          if (employeeData.success == false) {
            logout();
          }
          if (ticketData.success == false) {
            logout();
          }
          if (employeeTicketData.success == false) {
            logout();
          }
          if (quoteEmployeeData.success == false) {
            logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, []);

  if(employee != null){
  var employeeData = employee.data.find((data) => {
    return (data._id = employeeId);
  });
}
  if(quote != null){
  var overallQuoteData = quote.data.filter((data) => {
    return data.quoteStatus == "Pending";
  });
}
  

  if(quote != null){
  var openQuoteData = quote.data.filter((data) => {
    return data.quoteStatus == "Open";
  });
  }

  if(ticket != null){
  var pendingTicketData = ticket.data.filter((data) => {
    return data.status == "Pending";
  });
}

  if(ticket != null){
  var openTicketData = ticket.data.filter((data) => {
    return data.status == "Open";
  });
}

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
      if (quote !== null) {
        if (
          quote.message ==
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
  }, [user, service, quote, employee, ticket]);
  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Dashboard</h4>
        </div>
      </div>
      {employeeData && (
        <div>
          <h2 className="text-center mt-4">Welcome {employeeData.firstName}</h2>
        </div>
      )}

      {user != null && employeeTicket != null && (
        <Container>
          <Row className="justify-content-around gap-4 mt-5">
            <Col md={3} className="dashboard">
              <div className="border-bottom border-light">
                <h3 className="text-center pt-2">Registered User</h3>
              </div>
              <div className="text-center  p-2">
                <p>{user.data.length}</p>
              </div>
            </Col>
            <Col
              md={3}
              style={{ backgroundColor: "#b6e2d3" }}
              className="dashboard"
            >
              <div className="border-bottom border-light">
                <h3 className="text-center pt-2">Quotes Requests</h3>
              </div>
              <div className="text-center d-flex justify-content-around p-1">
                <div>
                  <p className="mb-0" style={{}}>
                    Overall Quotes
                  </p>
                  <p className="mb-0">{overallQuoteData.length}</p>
                </div>
                <div>
                  <p className="mb-0">In Progress</p>
                  <p className="mb-0">{openQuoteData.length}</p>
                </div>
              </div>
            </Col>
            <Col
              md={3}
              style={{ backgroundColor: "#d8a7b1" }}
              className="dashboard"
            >
              <div className="border-bottom border-light">
                <h3 className="text-center pt-2">Overall Tickets</h3>
              </div>
              <div className="text-center d-flex justify-content-around p-1">
                <div>
                  <p className="mb-0" style={{}}>
                    All Tickets
                  </p>
                  <p className="mb-0">{pendingTicketData.length}</p>
                </div>
                <div>
                  <p className="mb-0">In Progress</p>
                  <p className="mb-0">{openTicketData.length}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </AdminBaseApp>
  );
}
