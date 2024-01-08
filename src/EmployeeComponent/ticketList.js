import React, { useEffect, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import { AppState } from "../Context/AppProvider";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function TicketList() {
  const { user, setUser, ticket, setTicket } = AppState();
  const employeeId = localStorage.getItem("id");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://crm-4myq.onrender.com/ticket/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ticketData = await response.json();
    setTicket(ticketData);

    if (ticketData.success == false) {
      logout();
    }
  };
  const takeQuery = async (id) => {
    try {
      const response = await fetch(
        `https://crm-4myq.onrender.com/ticket/assign/${employeeId}/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const ticketData = await response.json();

      handleClick();
      getData();
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getData();
  }, []);

  const ticketData = ticket.data.filter((data) => {
    return data.status == "Pending";
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
    if (ticket !== null) {
      if (
        ticket.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user, ticket]);
  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Ticket List</h4>
        </div>
      </div>
      {(ticket, ticketData) && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Created On</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {ticketData.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.subject}</td>
                  <td>{data.description}</td>
                  <td>{data.status}</td>
                  <td>
                    {data.status == "Pending" ? (
                      <Button onClick={() => takeQuery(data._id)}>
                        Take Ticket
                      </Button>
                    ) : (
                      <Button disabled>Ticket Taken</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Ticket Assigned
        </Alert>
      </Snackbar>
    </AdminBaseApp>
  );
}
