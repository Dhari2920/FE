import './App.css';
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import UserLogin from './UserComponent/userLogin';
import EmployeeLogin from './EmployeeComponent/emplayeeLogin';
import UserSignUp from './UserComponent/userRegister';
import RequestQuote from './UserComponent/requestQuote';
import UserDashboard from './UserComponent/userDashboard';
import EmployeeDashboard from './EmployeeComponent/employeeDashboard';
import ListService from './EmployeeComponent/serviceList';
import CustomerList from './EmployeeComponent/customerList';
import ManageServiceRequest from './EmployeeComponent/serviceRequestList';
import QuoteDetails from './EmployeeComponent/quoteDetails';
import CreateTicket from './UserComponent/createTicket';
import UserManageTicket from './UserComponent/manageTicket';
import ViewTicket from './UserComponent/viewTicket';
import TicketList from './EmployeeComponent/ticketList';
import ManageTicket from './EmployeeComponent/manageTicket';
import EmployeeTicketSupport from './EmployeeComponent/employeeTicketSupport';
import TeamMember from './EmployeeComponent/teamMemberList';
import ManageQuote from './EmployeeComponent/manageQuote';
import UserProfile from './UserComponent/userProfile';
import EmployeeProfile from './EmployeeComponent/profile';
import EmailVerification from './UserComponent/emailVerification';
import ForgetPassword from './UserComponent/forgetPassword';
import ResetPassword from './UserComponent/resetPassword';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        {/* User */}
        <Route exact path="/user/login" element={<UserLogin/>}/>
        <Route path="/user/signup" element={<UserSignUp/>}/>
        <Route path="/user/profile" element={<UserProfile/>}/>
        <Route  path="/user/dashboard" element={<UserDashboard/>}/>
        <Route  path="/user/servicerequest" element={<RequestQuote/>}/>
        <Route  path="/ticket/user/support/:id" element={<ViewTicket/>}/>
        <Route  path="/ticket/create" element={<CreateTicket/>}/>
        <Route  path="/ticket/manage" element={<UserManageTicket/>}/>

        {/* SignIn,SignUp,Email Verification,Forget Password, Reset Password */}
        <Route  path="/email/verification/:id" element={<EmailVerification/>}/>
        <Route  path="/user/forget/password" element={<ForgetPassword/>}/>
        <Route  path="/user/reset/password/:id/:token" element={<ResetPassword/>}/>
        
        {/* Employee */}
        <Route path="/employee/login" element={<EmployeeLogin/>}/>
        <Route path="/employee/profile" element={<EmployeeProfile/>}/>
        <Route path="/service-list" element={<ListService/>}/>
        <Route path="/customer-list" element={<CustomerList/>}/>
        <Route  path="/employee/dashboard" element={<EmployeeDashboard/>}/>    
        <Route  path="/quote/details/:userId/:quoteId" element={<QuoteDetails/>}/>
        <Route  path="/servicerequest/list" element={<ManageServiceRequest/>}/>
        <Route  path="/manage/quote" element={<ManageQuote/>}/>
        <Route  path="/ticket/list" element={<TicketList/>}/>
        <Route  path="/ticket/employee/manage" element={<ManageTicket/>}/>
        <Route  path="/ticket/employee/support/:id" element={<EmployeeTicketSupport/>}/>
        <Route  path="/ticket/employee" element={<TeamMember/>}/>
        
        <Route path='*' element={<Navigate to="/user/login"/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
