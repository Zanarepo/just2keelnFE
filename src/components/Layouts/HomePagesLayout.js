import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import About from "./About";
import Register from "../CustomeAuth/Register";
import SignIn from "../CustomeAuth/SignIn";



const HomePageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content (Dynamically Rendered Based on Routes) */}
      <div className="flex-1 mt-16 sm:mt-20 px-4 sm:px-6 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          
    
          
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageLayout;
