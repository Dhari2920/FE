import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

export default function EmailVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `https://crm-4myq.onrender.com/user/email/verification/${id}`,
          {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success == true) {
          toast.success(result.message);
          navigate("/user/login");
        }
        if (result.success == false) {
          toast.error("URL Expired");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    verify();
  }, []);

  if (loading == true) {
    return (
      <div className="d-flex w-100 vh-100 justify-content-center align-items-center ">
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
        <Spinner animation="grow" />
      </div>
    );
  }
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center ">
      <h1>URL Expired</h1>
    </div>
  );
}
