import React, { useEffect, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import Table from "react-bootstrap/Table";
import { AppState } from "../Context/AppProvider";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

export default function CustomerList() {
  const navigate = useNavigate();

  const { service, setService, user, setUser,profile } = AppState();
  const [editData, setEditData] = useState("");
  const [editDataIndex, setEditDataIndex] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [createData, setCreateData] = useState("");

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const editPopOpen = (data, index) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setContactNumber(data.contactNumber);
    setAddress(data.address);
    setEditDataIndex(index);
    setEditData(data);
    setCompanyName(data.companyName);
    setOpen(true);
  };
  const createPopOpen = (data, index) => {
    setOpenCreate(true);
  };
  const createPopClose = () => {
    setOpenCreate(false);
  };

  const editPopClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const response = await fetch(`https://crm-4myq.onrender.com/user/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await response.json();
    setUser(userData);
  };

  const update = async () => {
    try {
      const data = {
        firstName,
        lastName,
        companyName,
        contactNumber,
        address,
      };
      const response = await fetch(
        `https://crm-4myq.onrender.com/user/update/${editData._id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      const selectedUser = user.data.filter((data) => {
        return data._id == editData._id;
      });
      getData();

      selectedUser[0].firstName = firstName;
      selectedUser[0].lastName = lastName;
      selectedUser[0].contactNumber = contactNumber;
      selectedUser[0].address = address;
      user.data[editDataIndex] = selectedUser[0];

      editPopClose();
    } catch (error) {
      console.log(error);
    }
  };

  const create = async () => {
    try {
      createPopClose();
      let serviceData = service;
      serviceData.data = [...service.data, createData];
      setService(serviceData);

      const data = {
        serviceName: createData,
      };
      const response = await fetch(`https://crm-4myq.onrender.com/service/add`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (data, index) => {
    try {
      let userData = user;
      userData.data.splice(index, 1);
      setService((pre) => (pre = userData));
      const response = await fetch(
        `https://crm-4myq.onrender.com/user/delete/${data._id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      getData();
    } catch (error) {
      console.log(error);
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

  return (
    <AdminBaseApp title="List Service">
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Customer List</h4>
        </div>
      </div>
      {service && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Registered on</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Company Name</th>
              <th>Contact No.</th>
              <th>Address</th>
              {profile.data.role == "Admin" ?<th>Options</th>:" "}
            </tr>
          </thead>
          <tbody>
            {user.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.email}</td>
                  <td>{data.companyName}</td>
                  <td>{data.contactNumber}</td>
                  <td>{data.address ? data.address : "null"}</td>
                  {profile.data.role == "Admin" ?<td>
                    <button
                      onClick={() => editPopOpen(data, index)}
                      className="option-btn"
                    >
                      <DriveFileRenameOutlineIcon />
                    </button>
                    <button
                      onClick={() => deleteService(data, index)}
                      className="option-btn"
                    >
                      <DeleteIcon />
                    </button>
                  </td> : " "}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Dialog
        open={open}
        onClose={editPopClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Edit"}</DialogTitle>
        <DialogContent>
          <Row>
            <Col className="pb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                defaultValue={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </Col>
            <Col className="pb-2">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                defaultValue={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </Col>
          </Row>
          <Form.Group className="pb-2" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              disabled
              type="email"
              defaultValue={editData.email}
              placeholder="Enter Email"
            />
          </Form.Group>
          <Form.Group className="pb-2" controlId="formGroupEmail">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              defaultValue={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </Form.Group>
          <Form.Label>Contact No.</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
            <Form.Control
              placeholder="Phone"
              onChange={(e) => setContactNumber(e.target.value)}
              defaultValue={contactNumber}
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => update()} style={{ marginRight: "12px" }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCreate}
        onClose={createPopClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create"}</DialogTitle>
        <DialogContent>
          <Row>
            <Col className="pb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control placeholder="First name" />
            </Col>
            <Col className="pb-2">
              <Form.Label>Last name</Form.Label>
              <Form.Control placeholder="Last name" />
            </Col>
          </Row>
          <Form.Group className="pb-2" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="pb-2" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="Address" />
          </Form.Group>
          <Form.Label>Contact No.</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
            <Form.Control
              placeholder="Phone"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => create()} style={{ marginRight: "12px" }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </AdminBaseApp>
  );
}
