import React, { useEffect, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import Table from "react-bootstrap/Table";
import { AppState } from "../Context/AppProvider";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

export default function TeamMember() {
  const navigate = useNavigate();

  const { service, setService, user, setUser, employee, setEmployee } =
    AppState();
  const [editData, setEditData] = useState("");
  const [editDataIndex, setEditDataIndex] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [roleCreate, setRoleCreate] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const employeeId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const editPopOpen = (data, index) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setRole(data.role);
    setEditDataIndex(index);
    setEditData(data);
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
    const response = await fetch(`https://crm-4myq.onrender.com/employee/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const employeeData = await response.json();
    setEmployee(employeeData);
  };

  const employeeData = employee.data.filter((data) => {
    return data._id != employeeId;
  });

  const update = async () => {
    try {
      const data = {
        firstName,
        lastName,
        role,
      };
      const response = await fetch(
        `https://crm-4myq.onrender.com/employee/update/${editData._id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      getData();
      const selectedEmployee = employee.data.filter((data) => {
        return data._id == employeeData[0]._id;
      });

      selectedEmployee[0].firstName = firstName;
      selectedEmployee[0].lastName = lastName;
      selectedEmployee[0].role = role;
      employee.data[editDataIndex] = selectedEmployee[0];

      editPopClose();
    } catch (error) {
      console.log(error);
    }
  };

  const create = async () => {
    try {
      const data = {
        firstName,
        lastName,
        email,
        password,
        role: roleCreate,
      };
      const response = await fetch(`https://crm-4myq.onrender.com/employee/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      getData();
      createPopClose();
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
        `https://crm-4myq.onrender.com/employee/delete/${data._id}`,
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
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [employee, user, service]);

  return (
    <AdminBaseApp title="List Service">
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Team Member List</h4>
        </div>
        <div className="sevice-title">
          <button className="create-btn" onClick={() => createPopOpen()}>
            <AddIcon /> Create
          </button>
        </div>
      </div>
      {employeeData && (
        <Table className="list-table" responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Registered on</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(data.createdAt).toLocaleString()}</td>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>
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
                  </td>
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
              placeholder="Enter email"
            />
          </Form.Group>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Role
              </InputLabel>
              <NativeSelect
                defaultValue={role}
                onChange={(e) => setRole(e.target.value)}
                inputProps={{
                  name: "role",
                  id: "uncontrolled-native",
                }}
              >
                <option value={"Employee"}>Employee</option>
                <option value={"Admin"}>Admin</option>
              </NativeSelect>
            </FormControl>
          </Box>
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
              <Form.Control
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </Col>
            <Col className="pb-2">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </Col>
          </Row>
          <Form.Group className="pb-2" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="pb-2" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Role
              </InputLabel>
              <NativeSelect
                defaultValue={roleCreate}
                onChange={(e) => setRoleCreate(e.target.value)}
                inputProps={{
                  name: "role",
                  id: "uncontrolled-native",
                }}
              >
                <option value={"Employee"}>Employee</option>
                <option value={"Admin"}>Admin</option>
              </NativeSelect>
            </FormControl>
          </Box>
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
