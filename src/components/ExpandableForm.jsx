import React, { useState } from "react";
import { Collapse, TextField, Container } from "@mui/material";
import "./ExpandableForm.css"; // Import CSS for additional styling if needed

const ExpandableForm = ({
  title,
  children,
  formData,
  handleChange,
  examResult,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle expansion of the form content
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Determine whether to show the form based on examResult
  const shouldExpand = () => {
    if (examResult === "Normal" && title === "Waiting List") {
      return false; // Do not expand if examResult is Normal and form is Waiting List
    }
    if (examResult === "Abnormal" && title === "Out Patients") {
      return false; // Do not expand if examResult is Abnormal and form is Out Patients
    }
    return true; // Expand for other cases
  };

  return (
    <div className={`expandable-form ${shouldExpand() ? "expanded" : ""}`}>
      <div className="expandable-header" onClick={toggleExpanded}>
        {title}
      </div>
      <Collapse in={expanded}>
        <div className="expandable-content">
          <div className="form-content">{children}</div>
        </div>
      </Collapse>
    </div>
  );
};

export default ExpandableForm;
