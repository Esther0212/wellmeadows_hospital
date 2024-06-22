import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import SidePanel from "../globalcomponents/SidePanel.jsx";
import TopPanel from "../globalcomponents/TopPanel.jsx";
import MainContent from "../globalcomponents/MainContent.jsx";
import { supabase } from "../components/supabase.js"; // Assuming you have initialized Supabase client

// Import images
import staffImage from "../images/staff.png";
import patientsImage from "../images/patients.png";
import wardsImage from "../images/wards.png";
import suppliesImage from "../images/supply.png";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staffDetails, setStaffDetails] = useState({
    staff_num: null,
    first_name: null,
    last_name: null,
  });

  useEffect(() => {
    if (location.state) {
      const { staff_num, first_name, last_name } = location.state;
      setStaffDetails({ staff_num, first_name, last_name });
    }
  }, [location.state]);

  useEffect(() => {
    if (
      staffDetails.staff_num &&
      (!staffDetails.first_name || !staffDetails.last_name)
    ) {
      fetchStaffDetails(staffDetails.staff_num);
    }
  }, [staffDetails.staff_num]);

  const fetchStaffDetails = async (staff_num) => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("first_name, last_name")
        .eq("staff_num", staff_num)
        .single();

      if (error) {
        throw error;
      }

      console.log("Fetched data:", data);

      if (data) {
        setStaffDetails((prevDetails) => ({
          ...prevDetails,
          first_name: data.first_name,
          last_name: data.last_name,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleNavigate = (route) => {
    navigate(`/dashboard/${route}`, { state: staffDetails });
  };

  const handleButtonClick = (index) => {
    switch (index) {
      case 1:
        handleNavigate("staff");
        break;
      case 2:
        handleNavigate("patients");
        break;
      case 3:
        handleNavigate("wards");
        break;
      case 4:
        handleNavigate("supplies");
        break;
      case 5:
        handleNavigate("about");
        break;
      default:
        break;
    }
  };

  // Determine if to show buttons based on current route
  const showButtons = !location.pathname.startsWith("/dashboard/");

  // Define buttons to be passed to MainContent component
  const buttons = (
    <div className="button-container">
      {showButtons && (
        <>
          <div className="top-buttons">
            <button
              className="dashboard-button"
              onClick={() => handleButtonClick(1)}
            >
              <img src={staffImage} alt="Staff" />
              <span className="button-text">Staff</span>
            </button>
            <button
              className="dashboard-button"
              onClick={() => handleButtonClick(2)}
            >
              <img src={patientsImage} alt="Patients" />
              <span className="button-text">Patients</span>
            </button>
          </div>
          <div className="bottom-buttons">
            <button
              className="dashboard-button"
              onClick={() => handleButtonClick(3)}
            >
              <img src={wardsImage} alt="Wards" />
              <span className="button-text">Wards</span>
            </button>
            <button
              className="dashboard-button"
              onClick={() => handleButtonClick(4)}
            >
              <img src={suppliesImage} alt="Supplies" />
              <span className="button-text">Supplies</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <SidePanel
        staff_num={staffDetails.staff_num}
        firstName={staffDetails.first_name}
        lastName={staffDetails.last_name}
      />
      <div className="content-area">
        <TopPanel
          staff_num={staffDetails.staff_num}
          firstName={staffDetails.first_name}
          lastName={staffDetails.last_name}
        />
        <MainContent staffDetails={staffDetails} buttons={buttons} />
      </div>
    </div>
  );
};

export default Dashboard;
