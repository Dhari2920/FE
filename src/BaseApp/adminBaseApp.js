import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { AppState } from "../Context/AppProvider";

export default function AdminBaseApp({ children }) {
  const navigate = useNavigate();
  const{profile} = AppState()
  const AdminProfileIcon = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#f5f5f9",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const logOut = () => {
    sessionStorage.clear();
    navigate("/user/login");
  };

  return (
    <div className="baseContainer">
      <div className="sideBar">
        <div>
          <span>
            <i className="bx bxs-tachometer icons"></i>
          </span>
          ZEN
        </div>
        <br></br>
        <a href="#" onClick={() => navigate("/employee/dashboard")}>
          <span>
            <i className="bx bxs-dashboard icons"></i>
          </span>
          Dashboard
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/service-list")}>
          <span>
            <i className="bx bx-list-ul icons"></i>
          </span>
          Service List
        </a>
        <br></br>
        {profile && profile.data.role == "Admin" ?
        <a href="#" onClick={() => navigate("/ticket/employee")}>
          <span>
            <i className="bx bx-list-ul icons"></i>
          </span>
          Team Member List
        </a>: null} 
        <br></br>
        <a href="#" onClick={() => navigate("/customer-list")}>
          <span>
            <i className="bx bx-list-ul icons"></i>
          </span>
          Customer List
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/servicerequest/list")}>
          <span>
            <i className="bx bxs-briefcase-alt-2 icons"></i>
          </span>
          Quotes List
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/manage/quote")}>
          <span>
            <i className="bx bxs-briefcase-alt-2 icons"></i>
          </span>
          Manage Quotes
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/ticket/list")}>
          <span>
            <i className="bx bxs-briefcase-alt-2 icons"></i>
          </span>
          Ticket List
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/ticket/employee/manage")}>
          <span>
            <i className="bx bxs-briefcase-alt-2 icons"></i>
          </span>
          Manage Ticket
        </a>
      </div>
      <div className="mainContainer">
        <div className="topbar" >
          <AdminProfileIcon
            arrow
            title={
              <React.Fragment>
                <div
                  className="profileBtn"
                  onClick={() => navigate("/employee/profile")}
                >
                  Profile
                </div>
                <div className="profileBtn" onClick={() => logOut()}>
                  LogOut
                </div>
              </React.Fragment>
            }
          >
            <div>
              <Avatar sx={{ bgcolor: deepOrange[500] }}></Avatar>
            </div>
          </AdminProfileIcon>
        </div>
        <div className="content-Container">{children}</div>
      </div>
    </div>
  );
}
