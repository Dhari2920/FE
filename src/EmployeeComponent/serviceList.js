import React, { useContext, useEffect, useRef, useState } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import Table from "react-bootstrap/Table";
import { AppContext } from "../Context/AppProvider";
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

export default function ListService() {
  const navigate = useNavigate();
  const { service, setService,profile } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [createData, setCreateData] = useState("");
  const [editData, setEditData] = useState("");
  const [editDataIndex, setEditDataIndex] = useState("");

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  const editPopOpen = (data, index) => {
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
  const update = async () => {
    try {
      const data = {
        serviceName: editData,
      };
      const response = await fetch(
        `https://crm-4myq.onrender.com/service/update/${editDataIndex}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      service.data[editDataIndex] = editData;

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
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (index) => {
    try {
      const response = await fetch(
        `https://crm-4myq.onrender.com/service/delete/${index}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();

      let serviceData = service;
      serviceData.data.splice(index, 1);
      setService(serviceData);
      const token = localStorage.getItem("token");

      const response2 = await fetch(`https://crm-4myq.onrender.com/service/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serviceData1 = await response2.json();
      setService(serviceData1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (service !== null) {
      if (
        service.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [service]);

  return (
    <AdminBaseApp title="List Service">
      <div className="service-list-header">
        <div className="sevice-title">
          <h4>Service List</h4>
        </div>
        {profile.data.role == "Admin" ?<div className="sevice-title">
          <button className="create-btn" onClick={() => createPopOpen()}>
            <AddIcon /> Create
          </button>
        </div>:" "}
      </div>
      {service && (
        <Table className="list-table"  responsive  striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Name</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {service.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data}</td>
                  {profile.data.role == "Admin" ? <td>
                    <button
                      onClick={() => editPopOpen(data, index)}
                      className="option-btn"
                    >
                      <DriveFileRenameOutlineIcon />
                    </button>
                    <button
                      onClick={() => deleteService(index)}
                      className="option-btn"
                    >
                      <DeleteIcon />
                    </button>
                  </td> : <td>
                    <button disabled
                      onClick={() => editPopOpen(data, index)}
                      className="option-btn"
                    >
                      <DriveFileRenameOutlineIcon />
                    </button>
                    <button disabled
                      onClick={() => deleteService(index)}
                      className="option-btn"
                    >
                      <DeleteIcon />
                    </button>
                  </td>}
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
        <DialogTitle id="alert-dialog-title">{"Update"}</DialogTitle>
        <DialogContent>
          <Form.Control
            type="text"
            className="mt-2 w-100"
            defaultValue={editData}
            onChange={(e) => setEditData(e.target.value)}
            placeholder="Service Name"
          />
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
          <Form.Control
            type="text"
            className="mt-2 w-100"
            defaultValue={""}
            onChange={(e) => setCreateData(e.target.value)}
            placeholder="Service Name"
          />
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
