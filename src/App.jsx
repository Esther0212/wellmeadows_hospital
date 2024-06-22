//src\App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"; // Import Dashboard component
import Profile from "./components/Profile"; // Import Profile component
import Staff from "./components/Staff"; // Import Staff component
import Patients from "./components/Patients"; // Import Patients component
import Wards from "./components/Wards"; // Import Wards component
import Supplies from "./components/Supplies"; // Import Supplies component
import AboutUs from "./components/AboutUs"; // Import AboutUs component
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/dashboard/staff/*" element={<Staff />} />
        <Route path="/dashboard/patients/*" element={<Patients />} />
        <Route path="/dashboard/wards/*" element={<Wards />} />
        <Route path="/dashboard/supplies/*" element={<Supplies />} />
        <Route path="/dashboard/about/*" element={<AboutUs />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
