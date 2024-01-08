import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const userSchemaValidation = yup.object({
    email: yup.string().email().required("Please enter a valid email address")
  });

  
export default function ForgetPassword(){
    const navigate = useNavigate();
    const[loading,setLoading] = useState(false)

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    
    const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: ""
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true)
          const response = await fetch("https://crm-4myq.onrender.com/user/forget-password", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
           
          })
          const result = await response.json();
          if (result.success == true) {
            handleClickOpen()
            resetForm()
          }
          if(result.success == false){
            toast.error(result.message);
          }
          setLoading(false)
         
        } catch (error) {
          console.log(error);
        }
      },
    });




    return(
        <Container fluid className="login">
      {loading ?(
    <Box sx={{ width: '100vw' }}>
      <LinearProgress />
    </Box>
  ) : " "}
        <div className="d-flex justify-content-between" >
            <span className="d-flex align-items-center">
                <h1 style={{fontWeight:"350"}}>CRM</h1>
            </span>
            <span className="d-flex align-items-center">
                <Button onClick={()=>navigate("/user/login")} variant="primary" type="submit">
                  USER SIGN IN
                </Button>
            </span>
        </div>
      <Row className="justify-content-around align-items-center">
      <Col  md={4}>
            <img  className="img-fluid" src="/crm.webp"></img>
        </Col>
       
        <Col md={4}>
        <h3 style={{fontWeight:"350"}} >Forget</h3>
<h6 style={{fontWeight:"350"}}>Your Password</h6>
          
          <Form onSubmit={handleSubmit} className="pt-3">
          
            <Form.Group className="pb-2"  controlId="formGroupEmail">
              <Form.Label>Enter your email address</Form.Label>
              <Form.Control value={values.email}
              name="email"
                onBlur={handleBlur}
                onChange={handleChange} type="email" placeholder="Enter email" />
            </Form.Group>
            {touched.email && errors.email ? (
                <p style={{ color: "crimson" }}>{errors.email}</p>
              ) : (
                ""
              )}
            
            <Button className="w-100" variant="primary" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="text-center mt-3">
          Not registered yet?{" "}
          <Link to={"/user/signup"}>Sign Up</Link>
          </div>
        </Col>
        
      </Row>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"A verification link has send to your email account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please click on the link that has just been sent to your email account to change your password
            and continue the password reset process.
            {"Note :"} Link valid for 15 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
    )
}