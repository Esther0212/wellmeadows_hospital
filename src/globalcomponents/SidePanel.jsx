import React, { useState, useEffect } from "react";
import "./SidePanel.css";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../components/supabase.js";

// Import images
import whLogo from "../images/wh_logo.png";
import staffIcon from "../images/side_staff.png";
import patientsIcon from "../images/side_patients.png";
import wardsIcon from "../images/side_wards.png";
import suppliesIcon from "../images/side_supplies.png";
import aboutUsIcon from "../images/about.png";
import Logout from "../images/logout.png";

const SidePanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    //STAFF
    staff_num,
    firstName: initialFirstName,
    lastName: initialLastName,
    fullAddress: initialfullAddress,
    telephoneNumber: initialtelephoneNumber,
    dateOfBirth: initialdateOfBirth,
    sex: initialsex,
    nin: initialnin,
  } = location.state || {};

  //STAFF
  const [firstName, setFirstName] = useState(initialFirstName || null);
  const [lastName, setLastName] = useState(initialLastName || null);
  const [fullAddress, setfullAddress] = useState(initialfullAddress || null);
  const [telephoneNumber, settelephoneNumber] = useState(
    initialtelephoneNumber || null
  );
  const [dateOfBirth, setdateOfBirth] = useState(initialdateOfBirth || null);
  const [sex, setsex] = useState(initialsex || null);
  const [nin, setnin] = useState(initialnin || null);

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
        .select("*")
        .eq("staff_num", staffNumber)
        .single();

      if (error) {
        throw error;
      }

      console.log("Fetched data:", data);

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setfullAddress(data.full_address);
        settelephoneNumber(data.telephone_num);
        setdateOfBirth(data.date_of_birth);
        setsex(data.sex);
        setnin(data.nin);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleNavigate = (index) => {
    let route = "/dashboard";
    switch (index) {
      case 1:
        route = "/dashboard/staff";
        break;
      case 2:
        route = "/dashboard/patients";
        break;
      case 3:
        route = "/dashboard/wards";
        break;
      case 4:
        route = "/dashboard/supplies";
        break;
      case 5:
        route = "/dashboard/about";
        break;
      default:
        break;
    }
    navigate(route, {
      state: {
        staff_num,
        firstName,
        lastName,
        fullAddress,
        telephoneNumber,
        dateOfBirth,
        sex,
        nin,
      },
    });
  };

  const handleLogout = () => {
    navigate("/login");
    // Additional logout logic can be added here
  };

  return (
    <div className="side-panel">
      <ul>
        <li>
          <button className="header-button" onClick={() => handleNavigate(0)}>
            <img src={whLogo} alt="Logo" className="logo" />
            <span>
              <h2>Wellmeadows Hospital Dashboard</h2>
              <hr className="line" />
            </span>
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={() => handleNavigate(1)}>
            <img src={staffIcon} alt="Staff" className="menu-icon" />
            <span>
              <p>Staff</p>
            </span>
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={() => handleNavigate(2)}>
            <img src={patientsIcon} alt="Patients" className="menu-icon" />
            <span>
              <p>Patients</p>
            </span>
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={() => handleNavigate(3)}>
            <img src={wardsIcon} alt="Wards" className="menu-icon" />
            <span>
              <p>Wards</p>
            </span>
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={() => handleNavigate(4)}>
            <img src={suppliesIcon} alt="Supplies" className="menu-icon" />
            <span>
              <p>Supplies</p>
            </span>
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={() => handleNavigate(5)}>
            <img src={aboutUsIcon} alt="About Us" className="menu-icon" />
            <span>
              <p>About Us</p>
            </span>
          </button>
        </li>
      </ul>
      <hr className="line" />
      <button className="menu-button logout-button" onClick={handleLogout}>
        <img src={Logout} alt="Logo" className="menu-icon" />
        <span>
          <p>Logout</p>
        </span>
      </button>
    </div>
  );
};

export default SidePanel;
