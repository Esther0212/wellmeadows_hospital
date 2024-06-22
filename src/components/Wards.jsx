import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SidePanel from "../globalcomponents/SidePanel";
import TopPanel from "../globalcomponents/TopPanel";
import ExpandableForm from "./ExpandableForm"; // Adjust the import path as per your project
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { supabase } from "../components/supabase.js"; // Assuming you have initialized Supabase client

const Wards = () => {
  const location = useLocation();
  const { staff_num, first_name, last_name } = location.state || {};

  // State for dropdowns and text fields
  const [formData, setFormData] = useState({
    wardName: "",
    location: "",
    telephoneExtensionNumber: "",
    waitingList: "",
    staffAssigned: {
      shift: "",
    },
    inPatients: {
      datePlacedOnWaitingList: "",
      expectedDurationOfStay: "",
      datePlacedInWards: "",
      dateOfExpectedLeave: "",
      dateOfActualLeave: "",
    },
    wardsRequisitions: {
      dateOrdered: "",
    },
  });

  // Handler for form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for nested form field changes
  const handleNestedChange = (event, parentField) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [parentField]: {
        ...prevState[parentField],
        [name]: value,
      },
    }));
  };

  // Handler for inserting data into PostgreSQL via Supabase
  const handleInsert = async () => {
    try {
      // Insert data into 'wards' table
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .insert([
          {
            ward_name: formData.wardName,
            location: formData.location,
            telephone_ext_num: formData.telephoneExtensionNumber,
          },
        ]);

      if (wardsError) {
        throw wardsError;
      }

      // Insert data into 'waiting_list' table
      const { data: waitingListData, error: waitingListError } = await supabase
        .from("waiting_list")
        .insert([
          {
            on_waiting_list: formData.waitingList,
            // Assuming you have patient_num from somewhere to link to patient table
            patient_num: "patient_num_value_here", // Replace with actual patient_num value
          },
        ]);

      if (waitingListError) {
        throw waitingListError;
      }

      // Insert data into 'staff_assigned_to_ward' table
      const { data: staffAssignedData, error: staffAssignedError } =
        await supabase.from("staff_assigned_to_ward").insert([
          {
            staff_num: staff_num, // Assuming staff_num comes from the location state
            ward_num: "ward_num_value_here", // Replace with actual ward_num value
            shift: formData.staffAssigned.shift,
          },
        ]);

      if (staffAssignedError) {
        throw staffAssignedError;
      }

      // Insert data into 'In_Patient' table
      const { data: inPatientsData, error: inPatientsError } = await supabase
        .from("In_Patient")
        .insert([
          {
            date_placed_on_waiting_list:
              formData.inPatients.datePlacedOnWaitingList,
            expected_duration_of_stay:
              formData.inPatients.expectedDurationOfStay,
            date_placed_in_ward: formData.inPatients.datePlacedInWards,
            date_of_expected_leave: formData.inPatients.dateOfExpectedLeave,
            date_of_actual_leave: formData.inPatients.dateOfActualLeave,
            // Assuming you have patient_num, staff_num, ward_num, and appointment_num
            // Replace these placeholders with actual values from your application
            patient_num: "patient_num_value_here",
            staff_num: staff_num,
            ward_num: "ward_num_value_here",
            appointment_num: "appointment_num_value_here",
          },
        ]);

      if (inPatientsError) {
        throw inPatientsError;
      }

      // Insert data into 'Ward_Requisition' table
      const { data: wardsRequisitionsData, error: wardsRequisitionsError } =
        await supabase.from("Ward_Requisition").insert([
          {
            staff_num: staff_num, // Assuming staff_num comes from the location state
            ward_num: "ward_num_value_here", // Replace with actual ward_num value
            date_ordered: formData.wardsRequisitions.dateOrdered,
          },
        ]);

      if (wardsRequisitionsError) {
        throw wardsRequisitionsError;
      }

      // Handle success scenario after all insertions
      console.log("Data inserted successfully");
      // Optionally reset form fields here
    } catch (error) {
      console.error("Error inserting data:", error.message);
      // Handle error scenarios
    }
  };

  return (
    <div className="dashboard-container">
      <SidePanel
        staff_num={staff_num}
        firstName={first_name}
        lastName={last_name}
      />
      <div className="content-area">
        <TopPanel
          staff_num={staff_num}
          firstName={first_name}
          lastName={last_name}
        />

        <div className="staff-container">
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              fullWidth: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Wards
          </h2>

          {/* Example of using ExpandableForm */}
          <ExpandableForm title="Wards">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="wardName-label">Ward Name</InputLabel>
                <Select
                  labelId="wardName-label"
                  name="wardName"
                  value={formData.wardName}
                  onChange={handleChange}
                  label="Ward Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  label="Location"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Separated">Separated</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Telephone Extension Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="telephoneExtensionNumber"
                value={formData.telephoneExtensionNumber}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Waiting List">
            <form>
              <TextField
                label="On Waiting List"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="waitingList"
                value={formData.waitingList}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Staff Assigned To Wards">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="shift-label">Shift</InputLabel>
                <Select
                  labelId="shift-label"
                  name="shift"
                  value={formData.staffAssigned.shift}
                  onChange={(e) => handleNestedChange(e, "staffAssigned")}
                  label="Shift"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Early">Early</MenuItem>
                  <MenuItem value="Late">Late</MenuItem>
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </Select>
              </FormControl>
            </form>
          </ExpandableForm>

          <ExpandableForm title="In Patients">
            <form>
              <TextField
                label="Date Placed On Waiting List"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="datePlacedOnWaitingList"
                value={formData.inPatients.datePlacedOnWaitingList}
                onChange={(e) => handleNestedChange(e, "inPatients")}
              />
              <TextField
                label="Expected Duration Of Stay"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="expectedDurationOfStay"
                value={formData.inPatients.expectedDurationOfStay}
                onChange={(e) => handleNestedChange(e, "inPatients")}
              />
              <TextField
                label="Date Placed               In Wards"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="datePlacedInWards"
                value={formData.inPatients.datePlacedInWards}
                onChange={(e) => handleNestedChange(e, "inPatients")}
              />
              <TextField
                label="Date of Expected Leave"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="dateOfExpectedLeave"
                value={formData.inPatients.dateOfExpectedLeave}
                onChange={(e) => handleNestedChange(e, "inPatients")}
              />
              <TextField
                label="Date of Actual Leave"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="dateOfActualLeave"
                value={formData.inPatients.dateOfActualLeave}
                onChange={(e) => handleNestedChange(e, "inPatients")}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Wards Requisitions">
            <form>
              <TextField
                label="Date Ordered"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="dateOrdered"
                value={formData.wardsRequisitions.dateOrdered}
                onChange={(e) => handleNestedChange(e, "wardsRequisitions")}
              />
            </form>
          </ExpandableForm>

          <Button
            variant="contained"
            color="primary"
            style={{
              display: "flex",
              justifyContent: "center",
              fullWidth: "100%",
              margin: "auto",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={handleInsert}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wards;
