import React, { useEffect } from "react";
import UserBaseApp from "../BaseApp/userBaseApp";
import { AppState } from "../Context/AppProvider";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function UserManageTicket() {
  const navigate = useNavigate();
  const { ticket, setTicket } = AppState();
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("userToken");
        const response = await fetch(
          `https://crm-4myq.onrender.com/ticket/data/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ticketData = await response.json();
        setTicket(ticketData);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (ticket !== null) {
      if (
        ticket.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [ticket]);
  return (
    <UserBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Manage Ticket</h4>
        </div>
      </div>
      {ticket.data && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Created At</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {ticket.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.subject}</td>
                  <td>{data.status}</td>
                  <td>
                    <Button
                      onClick={() =>
                        navigate(`/ticket/user/support/${data._id}`)
                      }
                    >
                      VIEW
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </UserBaseApp>
  );
}
