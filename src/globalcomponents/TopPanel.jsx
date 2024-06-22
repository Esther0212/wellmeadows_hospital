import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultUserImage from "../images/default_user.png";
import "./TopPanel.css";
import { supabase } from "../components/supabase.js"; // Assuming you have initialized Supabase client

const TopPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    staff_num,
    firstName: initialFirstName,
    lastName: initialLastName,
  } = location.state || {};

  const [firstName, setFirstName] = useState(initialFirstName || null);
  const [lastName, setLastName] = useState(initialLastName || null);
  const [avatarImage, setAvatarImage] = useState(null);

  useEffect(() => {
    if (!staff_num) {
      console.error("No staff number provided in location state.");
      return;
    }

    fetchStaffDetails(staff_num);
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

      console.log("Fetched staff data:", data);

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
      }

      // Fetch user details including avatar
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("avatar_image")
        .eq("staff_num", staffNumber)
        .single();

      if (userError) {
        throw userError;
      }

      console.log("Fetched user data:", userData);

      if (userData && userData.avatar_image) {
        const avatarUrl = URL.createObjectURL(
          new Blob([userData.avatar_image], { type: "image/png" })
        );
        setAvatarImage(avatarUrl);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/profile", { state: { staff_num, firstName, lastName } });
  };

  return (
    <div className="top-panel">
      <div className="greeting-text">
        <h2>
          <span style={{ color: "black" }}>Welcome back!</span>
        </h2>
      </div>
      <button className="user-avatar-button" onClick={handleNavigateToProfile}>
        <img
          src={avatarImage || defaultUserImage}
          alt="User Avatar"
          className="user-avatar"
        />
        {firstName && lastName && (
          <span className="avatar-info">
            {firstName} {lastName}
          </span>
        )}
      </button>
    </div>
  );
};

export default TopPanel;
