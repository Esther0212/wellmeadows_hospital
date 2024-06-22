// UserAvatar.js
import React from "react";
import PropTypes from "prop-types";
import defaultUserImage from "../images/default_user.png";
import "./UserAvatar.css"; // Ensure you have styles for the avatar

const UserAvatar = ({ staff_num, firstName, lastName }) => {
  return (
    <div className="user-avatar-container">
      <img src={defaultUserImage} alt="User Avatar" className="user-avatar" />
      <div className="user-info">
        <p>
          {firstName} {lastName}
        </p>
        <p>Staff Number: {staff_num}</p>
      </div>
    </div>
  );
};

UserAvatar.propTypes = {
  staff_num: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default UserAvatar;
