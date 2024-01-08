import React, { useEffect } from "react";
import AdminBaseApp from "../BaseApp/adminBaseApp";
import { useParams, useNavigate } from "react-router-dom";
import { AppState } from "../Context/AppProvider";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

const serviceRequestValidationSchema = yup.object().shape({
  quoteStatus: yup.string().required("Please enter a valid email address"),
  remark: yup
    .string()
    .required("Please enter remark ")
    .min(15, "Minimum 15 charactor is required"),
});

export default function QuoteDetails() {
  const { userId, quoteId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, quote, setQuote, employee, setEmployee } = AppState();
  const id = localStorage.getItem("id");
  const userData = user.data.find((data) => {
    return data._id == userId;
  });
  const quoteData = quote.data.find((data) => {
    return data._id == quoteId;
  });
  const quoteIndex = quote.data.findIndex((data) => {
    return data._id == quoteId;
  });
  let employeeData = null;
  if (quoteData.employeeId) {
    employeeData = employee.data.find((data) => {
      return quoteData.employeeId == data._id;
    });
  }

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/employee/login");
  };
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        remark: "",
        quoteStatus: quoteData.quoteStatus,
      },
      validationSchema: serviceRequestValidationSchema,
      onSubmit: async (data) => {
        try {
          const response = await fetch(
            `https://crm-4myq.onrender.com/quote/update/${id}/${quoteData._id}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          const quote_data = quoteData;
          quote_data.quoteStatus = data.quoteStatus;
          quote_data.remark = data.remark;
          quote_data.employeeId = id;
          quote_data.closedAt = new Date().toString();
          const quote_2 = quote;
          quote_2.data[quoteIndex] = quote_data;
          setQuote(quote_2);
          navigate("/manage/quote");
        } catch (error) {
          console.log(error);
        }
      },
    });

  useEffect(() => {
    if (user !== null) {
      if (
        user.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (employee !== null) {
      if (
        employee.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
    if (quote !== null) {
      if (
        quote.message ==
        ("Token Experied" || "Token Not Found" || "User Does't Exist")
      ) {
        logout();
      }
    }
  }, [user, employee, quote]);
  return (
    <AdminBaseApp>
      <form onSubmit={handleSubmit}>
        <div className="service-list-header">
          <div className="sevice-title">
            <h4>Quote Details</h4>
          </div>
        </div>
        {userData && (
          <div>
            <div className="quote-details-container">
              <div className="d-flex justify-content-between pt-3 ">
                <p className="quote-details-header-title">
                  {userData.firstName}'s Quote Details
                </p>
                <div className="d-flex gap-5">
                  <Box sx={{ minWidth: 120 }}>
                    {quoteData.quoteStatus == "Closed Won" ||
                    quoteData.quoteStatus == "Closed Lost" ? (
                      <FormControl fullWidth disabled>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Status
                        </InputLabel>
                        <NativeSelect
                          defaultValue={values.quoteStatus}
                          onChange={handleChange}
                          inputProps={{
                            name: "quoteStatus",
                            id: "uncontrolled-native",
                          }}
                        >
                          <option value={"Open"}>Open</option>
                          <option value={"Closed Won"}>Closed Won</option>
                          <option value={"Closed Lost"}>Closed Lost</option>
                        </NativeSelect>
                      </FormControl>
                    ) : (
                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Status
                        </InputLabel>
                        <NativeSelect
                          defaultValue={values.remark}
                          onChange={handleChange}
                          inputProps={{
                            name: "quoteStatus",
                            id: "uncontrolled-native",
                          }}
                        >
                          <option value={"Open"}>Open</option>
                          <option value={"Closed Won"}>Closed Won</option>
                          <option value={"Closed Lost"}>Closed Lost</option>
                        </NativeSelect>
                      </FormControl>
                    )}
                  </Box>

                  <CloseButton
                    onClick={() => navigate("/manage/quote")}
                    className="close-btn"
                  />
                </div>
              </div>
              <div className="quote-user-details">
                <div>
                  <p>Firsh Name</p>
                  <p>Last Name</p>
                  <p>Email</p>
                  <p>Contact No.</p>
                  <p>Company</p>
                  <p>Clint</p>
                </div>
                <div>
                  <p>{userData.firstName}</p>
                  <p>{userData.lastName}</p>
                  <p>{userData.email}</p>
                  <p>{userData.contactNumber}</p>
                  <p>{userData.companyName}</p>
                  {userData.address && <p>{userData.address}</p>}
                  <p>{quoteData.status}</p>
                </div>
              </div>
              <div className="quote-query-details">
                <p style={{ fontWeight: "600" }}>Required Service</p>
                <p>{quoteData.serviceRequest.join(",")}</p>
              </div>
              <div className="quote-query-details">
                <p style={{ fontWeight: "600" }}>Request Opened At</p>
                <p>
                  {new Date(quoteData.createdAt).toLocaleString().split(",")}
                </p>
              </div>
              {quoteData.closedAt && (
                <div className="quote-query-details">
                  <p style={{ fontWeight: "600" }}>Request Closed At</p>
                  <p>
                    {new Date(quoteData.closedAt).toLocaleString().split(",")}
                  </p>
                </div>
              )}
              {(quoteData.employeeId, employeeData) && (
                <div className="quote-query-details">
                  <p style={{ fontWeight: "600" }}>Closed By</p>
                  <p>{employeeData.firstName}</p>
                  <p>{employeeData._id}</p>
                </div>
              )}
              <div>
                <div className="quote-query-details mt-4">
                  <p style={{ fontWeight: "800" }}>Description</p>
                  <p>{quoteData.description}</p>
                </div>
                <div className="quote-query-details mt-4">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label style={{ fontWeight: "600" }}>
                      Remark
                    </Form.Label>
                    {quoteData.quoteStatus == "Closed Won" ||
                    quoteData.quoteStatus == "Closed Lost" ? (
                      <p className="pb-3">{quoteData.remark}</p>
                    ) : (
                      <Form.Control
                        name="remark"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.remark}
                        as="textarea"
                        rows={3}
                      />
                    )}
                  </Form.Group>
                  {touched.remark && errors.remark ? (
                    <p style={{ color: "crimson" }}>{errors.remark}</p>
                  ) : (
                    ""
                  )}
                </div>
                {quoteData.quoteStatus == "Closed Won" ||
                quoteData.quoteStatus == "Closed Lost" ? (
                  " "
                ) : (
                  <Button className="quote-query-details mb-3" type="submit">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminBaseApp>
  );
}
