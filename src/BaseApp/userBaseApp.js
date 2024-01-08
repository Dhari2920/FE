import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

export default function UserBaseApp({ title, children }) {
  const navigate = useNavigate();

  const ProfileIcon = styled(({ className, ...props }) => (
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
    localStorage.clear();
    navigate("/user/login");
  };

  return (
    <div className="baseContainer">
      <div className="sideBar">
        <div>
          <span>
            <i className="bx bxs-tachometer icons"></i>
          </span>
          CRM
        </div>
        <br></br>
        <a href="#" onClick={() => navigate("/user/dashboard")}>
          <span>
            <i className="bx bxs-dashboard icons"></i>
          </span>
          Dashboard
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/user/servicerequest")}>
          <span>
            <i className="bx bx-list-ul icons"></i>
          </span>
          Request Quote
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/ticket/create")}>
          <span>
            <i className="bx bx-list-ul icons"></i>
          </span>
          Create Ticket
        </a>
        <br></br>
        <a href="#" onClick={() => navigate("/ticket/manage")}>
          <span>
            <i className="bx bxs-briefcase-alt-2 icons"></i>
          </span>
          Manage Ticket
        </a>
      </div>
      <div className="mainContainer">
        <div className="topbar" >
          <div>{title}</div>
          <ProfileIcon
            arrow
            title={
              <React.Fragment>
                <div
                  className="profileBtn"
                  onClick={() => navigate("/user/profile")}
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
          </ProfileIcon>
        </div>
        <div className="content-Container">{children}</div>
      </div>
    </div>
  );
}
