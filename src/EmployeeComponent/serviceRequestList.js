import React, { useEffect, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import Table from "react-bootstrap/Table";
import { AppState } from "../Context/AppProvider";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ManageServiceRequest() {
  const { service, setService, user, setUser, quote, setQuote } = AppState();
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("id");

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://crm-4myq.onrender.com/quote/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const quoteData = await response.json();
    setQuote(quoteData);

    if (quoteData.success == false) {
      logout();
    }
  };
 

  const takeQuote = async (id) => {
    try {
      const response = await fetch(
        `https://crm-4myq.onrender.com/quote/assign/${employeeId}/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const quoteData = await response.json();
      getData();
      handleClick();
    } catch (error) {
      console.log(error);
    }
  };

  const quoteData = quote.data.filter((data) => {
    return data.quoteStatus == "Pending";
  });

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (quote !== null) {
      if (
        quote.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user, service, quote]);

  return (
    <AdminBaseApp>
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Quote Details</h4>
        </div>
      </div>
      {(quote, user, quoteData) && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Company Name</th>
              <th>Status</th>
              <th>Service Request</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quoteData.map((data, index) => {
              const finalData = user.data.find((datas) => {
                return data.userId == datas._id;
              });
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{finalData.firstName}</td>
                  <td>{finalData.lastName}</td>
                  <td>{finalData.email}</td>
                  <td>{finalData.companyName}</td>
                  <td>{data.quoteStatus}</td>
                  <td>{data.serviceRequest.join(",")}</td>
                  <td>
                    {data.quoteStatus == "Pending" ? (
                      <Button onClick={() => takeQuote(data._id)}>
                        Take Quote
                      </Button>
                    ) : (
                      <Button disabled>Quote Taken</Button>
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
          Quote Request Assigned
        </Alert>
      </Snackbar>
    </AdminBaseApp>
  );
}
