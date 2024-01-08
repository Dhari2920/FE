import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import { AppState } from "../Context/AppProvider";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

export default function ManageQuote() {
  const { user, setUser, employeeQuote, setEmployeeQuote } = AppState();
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
      `https://crm-4myq.onrender.com/quote/data/employee/${employeeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const quoteData = await response.json();
    setEmployeeQuote(quoteData);
    if (quoteData.success == false) {
      logout();
    }
  };

  useEffect(() => {
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user]);

  useEffect(() => {
    getData();
  }, []);
  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Manage Quote</h4>
        </div>
      </div>
      {employeeQuote && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Created On</th>
              <th>Service Required</th>
              <th>Description</th>

              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeQuote.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.serviceRequest.join(",")}</td>
                  <td>{data.description}</td>

                  <td>{data.quoteStatus}</td>
                  <td>
                    <Button
                      onClick={() =>
                        navigate(`/quote/details/${data.userId}/${data._id}`)
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
