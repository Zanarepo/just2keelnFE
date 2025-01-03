import React from 'react'; // Ensure React is imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./components/Auth/Dashboard";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import ResetPassword from "./components/Auth/ResetPassword";
import CleanerSignup from "./components/Auth/CleanerSignup";
import ClientRegistration from "./components/Auth/ClientRegistration";
import ClientsReg from "./components/CustomeAuth/ClientsReg"
import CleanersReg from "./components/CustomeAuth/CleanersReg"
import Register from "./components/CustomeAuth/Register"
import SignIn from "./components/CustomeAuth/SignIn"
import PersonalDetails from "./components/CleanersDashboard/PersonalDetails"
import ServiceSection from "./components/CleanersDashboard/ServiceSection"
import ServiceLocationYearsAvailability from "./components/CleanersDashboard/ServiceLocationYearsAvailability"
import MyBio from "./components/CleanersDashboard/MyBio"
import ProfileDashboard from "./components/CleanersDashboard/ProfileDashboard"



















function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cleaner-signup" element={<CleanerSignup />} />
        <Route path="/client-signup" element={<ClientRegistration />} />
        <Route path="/client-reg" element={<ClientsReg />} />
        <Route path="/cleaner-reg" element={<CleanersReg />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/sign" element={<SignIn />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        
        
        <Route path="/dashboard"element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>  }
        />

        <Route>
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/service-section" element={<ServiceSection />} />
        <Route path="/service-location" element={<ServiceLocationYearsAvailability />} />
        <Route path="/bio" element={<MyBio />} />
        
        
        
        </Route>





      </Routes>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </Router>
  );
}

export default App;
