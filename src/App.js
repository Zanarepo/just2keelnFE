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

import ProfileVerification from "./components/ProfileVerifications/ProfileVerification"
import BookingForm from "./components/BookingsProcess/BookingForm"
 import PublicDashboard from "./components/CleanersDashboard/PublicDashboard"
  import CleanerReviews from "./components/BookingsProcess/CleanerReviews"
import ClientProfile from "./components/ClientProfile/ClientProfile"
import BookingsSection  from "./components/ClientProfile/BookingsSection"
import ReviewPromptSection from "./components/ClientProfile/ReviewPromptSection"
import ClientDashboard from "./components/ClientProfile/ClientDashboard"
import PaymentsSection from "./components/ClientProfile/PaymentsSection"
import AdminCleanersDashboard from "./components/AdminDashboard/AdminCleanersDashboard"
import ManageReviews from "./components/AdminDashboard/ManageReviews"
import ManageCleanersVerification from "./components/AdminDashboard/ManageCleanersVerification"
import ManagePayments from "./components/AdminDashboard/ManagePayments"
import ProvidersDashboard from "./components/AdminDashboard/ProvidersDashboard"
import ClientList from  "./components/ClientsActivities/ClientList"
import ClientSubscriptions from "./components/ClientsActivities/ClientSubscriptions"
import ClientSchedules from "./components/ClientsActivities/ClientSchedules"
import ClientCleanerMatch from "./components/ClientsActivities/ClientCleanerMatch"
  














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
        <Route path="/profile-verification" element={<ProfileVerification />} />
        </Route>

        <Route>

        <Route path="/booking" element={<BookingForm />} />
        
        <Route path="/public-dashboard" element={<PublicDashboard />} />
        <Route path="/cleaner-reviews" element={<CleanerReviews />} />
        <Route path="/prompt-review" element={<ReviewPromptSection />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        
        
        
        
        
        </Route>
        
        <Route>

<Route path="/client-profile" element={<ClientProfile />} />

<Route path="/booking-section" element={<BookingsSection  />} />
<Route path="/cleaner-reviews" element={<CleanerReviews />} />
 <Route path="/client-payments" element={<PaymentsSection />} />



</Route>
        

<Route>

<Route path="/client-profile" element={<AdminCleanersDashboard />} />

<Route path="/admincleanerdashboard" element={<AdminCleanersDashboard  />} />
<Route path="/manage-reviews" element={<ManageReviews />} />
 <Route path="/client-payments" element={<AdminCleanersDashboard />} />
 <Route path="/cleaners-verify" element={<ManageCleanersVerification />} />
  <Route path="/manage-payment" element={<ManagePayments />} />
  <Route path="/providers-dashboard" element={<ProvidersDashboard />} />
  
</Route>
        


<Route>

<Route path="/client-list" element={<ClientList />} />

<Route path="/client-subscriptions" element={<ClientSubscriptions/>} />
<Route path="/client-schedules" element={<ClientSchedules/>} />
<Route path="/client-match" element={<ClientCleanerMatch/>} />

  
</Route>
     









      </Routes>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </Router>
  );
}

export default App;
