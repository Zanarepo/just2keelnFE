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
import ClientServicesDashboard from "./components/ClientsActivities/ClientServicesDashboard"
import About from "./components/Homepage/About"
import HomePagesLayout from "./components/Homepage/HomePagesLayout"
import  Home from "./components/Homepage/Home"
import AdminLayout from "./components/Layouts/AdminLayout"
import ProvidersLayout from './components/Layouts/ProvidersLayout';
import ProfilePages from "./components/CleanersDashboard/ProfilePages"
import CleanerSchedules from "./components/CleanersDashboard/CleanerSchedules"
import CleanerBookings from "./components/CleanersDashboard/CleanerBookings"
import RequestQuoteForm from "./components/QuotesDashboard/RequestQuoteForm"
import SubmitBid from "./components/QuotesDashboard/SubmitBid"
import Quotedashboard from "./components/CleanersDashboard/Quotedashboard"
import CleanerQuoteDb   from "./components/CleanersDashboard/CleanerQuoteDb"
import ApprovedBids from "./components/QuotesDashboard/ApprovedBids"
import CleanerBids from "./components/QuotesDashboard/CleanerBids"
import BidsDashboard from "./components/CleanersDashboard/BidsDashboard"
import CleanerBookingDetails from "./components/CleanersDashboard/CleanerBookingDetails"
import BookingsDashboard from "./components/BookingsProcess/BookingsDashboard"
import AdminRegistration from "./components/AdminDashboard/AdminRegistration"
import AdminWelcomePage from "./components/AdminDashboard/AdminWelcomePage"
import RequestQuote from "./components/Homepage/RequestQuote"
import AnonRequestQuote from "./components/QuotesDashboard/AnonRequestQuote"
import AnonRequestQuoteForm from "./components/QuotesDashboard/AnonRequestQuoteForm"
import LandingPageForm from "./components/QuotesDashboard/LandingPageForm"
import SearchAndBookComponent from "./components/QuotesDashboard/SearchAndBookComponent"
import GuestBookingsComponent from "./components/BookingsProcess/GuestBookingsComponent"
import GuestQuoteRequests from "./components/BookingsProcess/GuestQuoteRequests"
import ManageBids from "./components/BookingsProcess/ManageBids"
import BidDetails   from "./components/BookingsProcess/BidDetails"
import GuestandClientQuoteDashboard from "./components/BookingsProcess/GuestandClientQuoteDashboard"
import AdminQuoteRequests from "./components/AdminDashboard/AdminQuoteRequests"
import AdminGuestQuotesRequest from "./components/AdminDashboard/AdminGuestQuotesRequest"
import  AdminBids from "./components/AdminDashboard/AdminBids"
import AdminGuestBooking from "./components/AdminDashboard/AdminGuestBooking"
import AdminCleanerSchedules from "./components/AdminDashboard/AdminCleanerSchedules"
import GeneralDashboards from "./components/AdminDashboard/GeneralDashboards"
import CleaningPricesForm from "./components/Homepage/CleaningPricesForm"
import CleaningServicesSlideshow from "./components/Homepage/CleaningServicesSlideshow"
import Post from "./components/QuotesDashboard/Post"
import CleaningOfferingsSlideshow from "./components/Homepage/CleaningOfferingsSlideshow"





function App() {
  return (
    <Router>

<Routes>

         {/* HomePageLayout Routes */}
         <Route path="/" element={<HomePagesLayout/>}>
          <Route index element={<Home />} />
          <Route path="about" element={<About/>} />
          <Route path="sign" element={<SignIn />} />
          <Route path="register" element={<Register/>} />

          
         
       
    
         
        </Route>

 {/*  Dashboards */}
 <Route path="/" element={<AdminLayout/>}>
 
      <Route path="providers-dashboard" element={<ProvidersDashboard />} />
      <Route path="client-dashboard" element={<ClientServicesDashboard/>} />
      <Route path="admindashboard" element={<AdminWelcomePage/>} />
      <Route path="manage-bids" element={<ManageBids/>} />
      <Route path="admin-quoterequest" element={<AdminQuoteRequests/>} />
      <Route path="admin-guestquotesreq" element={<AdminGuestQuotesRequest/>} />
      <Route path="admin-bids" element={<AdminBids/>} />
      <Route path="admin-guestbooking" element={<AdminGuestBooking/>} />
      <Route path="admin-cleanersschedule" element={<AdminCleanerSchedules/>} />
      <Route path="general-dashboards" element={<GeneralDashboards/>} />
      

</Route>










    {/*  Users Profile Section */}
    <Route path="/" element={<ProvidersLayout/>}>
   
    <Route path="profiless" element={<ProfileDashboard />} />  {/*  Users Dashboard */}

    <Route path="/service-section" element={<ServiceSection />} />
    <Route path="/service-location" element={<ServiceLocationYearsAvailability />} />
    <Route path="/bio" element={<MyBio />} />
    <Route path="/profile-verification" element={<ProfileVerification />} />
    <Route path="/public-dashboard" element={<PublicDashboard />} />
    <Route path="personal-details" element={<PersonalDetails />} />
    <Route path="profile-pages" element={<ProfilePages />} />
    <Route path="submit-bid" element={<SubmitBid />} />
    <Route path="cleaner-quotedb" element={<CleanerQuoteDb />} />
    <Route path="cleaner-bids" element={<CleanerBids />} />
    <Route path="bids-dashboard" element={<BidsDashboard />} />
    <Route path="cleaner-schedules" element={<CleanerSchedules />} />
    <Route path="bookings" element={<CleanerBookingDetails />} />
    <Route path="booking" element={<BookingForm />} />
    <Route path="guest-booking" element={<GuestBookingsComponent />} />
    <Route path="guest-quotes" element={<GuestQuoteRequests />} />
    <Route path="bids-details" element={<BidDetails />} />
    <Route path="quote-bookingdashboard" element={<GuestandClientQuoteDashboard />} />
    <Route path="quote-bookingdashboard" element={<GuestandClientQuoteDashboard />} />
    
    
    </Route>

</Routes>










      
      <Routes>

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cleaner-signup" element={<CleanerSignup />} />
      <Route path="/client-signup" element={<ClientRegistration />} />
      <Route path="/client-reg" element={<ClientsReg />} />
      <Route path="/cleaner-reg" element={<CleanersReg />} />
      <Route path="/anonquote" element={<AnonRequestQuote/>} />
      <Route path="/anonrequest-quote" element={<AnonRequestQuoteForm />} />
      <Route path="/landingpage-form" element={<LandingPageForm />} />
      <Route path="/search" element={<SearchAndBookComponent />} />
       <Route path="/post" element={<Post />} />
      <Route path="cleaner-bookings" element={<CleanerBookings />} />
      <Route path="profiles" element={<ProfileDashboard />} />
      <Route path="/dashboard"element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>  }
      />

    {/*  Users Profile Section */}


    {/* clients dashboard */}
    <Route>
  
     <Route path="/cleaning-prices" element={<CleaningPricesForm />} />
    <Route path="/cleaner-reviews" element={<CleanerReviews />} />
    <Route path="/prompt-review" element={<ReviewPromptSection />} />
    <Route path="/clientdashboard" element={<ClientDashboard />} />   {/* clients dashboard */}
    </Route>
     {/* clients dashboard */}


    <Route>
    <Route path="/client-profile" element={<ClientProfile />} />
    <Route path="/booking-section" element={<BookingsSection  />} />
    <Route path="/booking-db" element={<BookingsDashboard/>} />
    <Route path="/client-payments" element={<PaymentsSection />} />
    <Route path="/request-quote" element={<RequestQuoteForm />} />
   
    <Route path="/quotes-db" element={<Quotedashboard/>} />
    <Route path="/approved-bids" element={<ApprovedBids/>} />
    
    <Route path="quote" element={<RequestQuote/>} />
    
   
    </Route>
    

    <Route>
    <Route path="/client-profile" element={<AdminCleanersDashboard />} />
    <Route path="/admincleanerdashboard" element={<AdminCleanersDashboard  />} />
    <Route path="/manage-reviews" element={<ManageReviews />} />
    <Route path="/client-payments" element={<AdminCleanersDashboard />} />
    <Route path="/cleaners-verify" element={<ManageCleanersVerification />} />
    <Route path="/manage-payment" element={<ManagePayments />} />
    <Route path="/services-slides" element={<CleaningServicesSlideshow />} />
    <Route path="/offering-slides" element={<CleaningOfferingsSlideshow />} />
    </Route>


    <Route>
    <Route path="/client-list" element={<ClientList />} />
    <Route path="/client-subscriptions" element={<ClientSubscriptions/>} />
    <Route path="/client-schedules" element={<ClientSchedules/>} />
    <Route path="/client-match" element={<ClientCleanerMatch/>} />

    </Route>
    
    <Route path="adminregister" element={<AdminRegistration/>} />


    <Route path="/test" element={<test/>} />





      </Routes>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </Router>
  );
}

export default App;
