import React, { useState } from "react";
import { TextField, Container } from "@mui/material";
import "./ExpandableForm.css"; // Import CSS for additional styling if needed

const ExpandableForm = ({ title, children, formData, handleChange }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`expandable-form ${expanded ? "expanded" : ""}`}>
      <div className="expandable-header" onClick={toggleExpanded}>
        {title}
      </div>
      <div className="expandable-content">
        <div className="form-content">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableForm;
