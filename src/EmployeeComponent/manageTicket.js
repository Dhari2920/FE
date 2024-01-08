import React, { useEffect, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { AppState } from "../Context/AppProvider";
import { useNavigate } from "react-router-dom";

export default function ManageTicket() {
  const { employeeTicket, setEmployeeTicket } = AppState();
  const [loading, setLoading] = useState(true);
  const employeeId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    const employeeId = localStorage.getItem("id");
    const response = await fetch(
      `https://crm-4myq.onrender.com/ticket/data/employee/${employeeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const ticketData = await response.json();
    setEmployeeTicket(ticketData);
    setLoading(false);
    if (ticketData.success == false) {
      logout();
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Manage Ticket</h4>
        </div>
      </div>
      {employeeTicket && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Created On</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeTicket.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.subject}</td>
                  <td>{data.description}</td>
                  <td>{data.status}</td>
                  <td>
                    <Button
                      onClick={() =>
                        navigate(`/ticket/employee/support/${data._id}`)
                      }
                    >
                      Support
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </AdminBaseApp>
  );
}
