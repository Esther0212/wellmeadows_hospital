import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import Staff from "../components/Staff";
import Patients from "../components/Patients";
import Wards from "../components/Wards";
import Supplies from "../components/Supplies";
import AboutUs from "../components/AboutUs"; // Make sure you have this component
import { supabase } from "../components/supabase.js"; // Assuming you have initialized Supabase client

const MainContent = ({ buttons }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    staff_num,
    firstName: initialFirstName,
    lastName: initialLastName,
  } = location.state || {};

  const [firstName, setFirstName] = useState(initialFirstName || null);
  const [lastName, setLastName] = useState(initialLastName || null);

  useEffect(() => {
    if (staff_num) {
      fetchStaffDetails(staff_num);
    } else {
      console.error("No staff number provided in props.");
    }
  }, [staff_num]);

  const fetchStaffDetails = async (staffNumber) => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("first_name, last_name")
        .eq("staff_num", staffNumber)
        .single();

      if (error) {
        throw error;
      }

      console.log("Fetched data:", data);

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div className="main-content">
      {buttons && <>{buttons}</>}
      <Routes>
        <Route path="/dashboard/staff/*" element={<Staff />} />
        <Route path="/dashboard/patients/*" element={<Patients />} />
        <Route path="/dashboard/wards/*" element={<Wards />} />
        <Route path="/dashboard/supplies/*" element={<Supplies />} />
        <Route path="/dashboard/about/*" element={<AboutUs />} />{" "}
        <Route path="/dashboard/profile/*" element={<Supplies />} />
      </Routes>
    </div>
  );
};

export default MainContent;
