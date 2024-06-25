import React, { useState, useEffect } from "react";
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
    chargeNurseFullName: "",
    wardName: "",
    location: "",
    telephoneExtensionNumber: "",
    staffAssigned: "",
    shift: "",
    patientName: "",
    datePlacedOnWaitingList: "",
    expectedDurationOfStay: "",
    datePlacedInWards: "",
    dateOfExpectedLeave: "",
    dateOfActualLeave: "",
    unitsPerDay: "",
    medStart: "",
    medFinish: "",
    dateOrdered: "",
  });

  const [chargeNurses, setChargeNurses] = useState([]);
  const [appointmentNum, setAppointmentNum] = useState(null);
  const [patientNum, setPatientNum] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientNum, setSelectedPatientNum] = useState(null);

  useEffect(() => {
    const fetchChargeNurses = async () => {
      try {
        const { data, error } = await supabase
          .from("position")
          .select(
            `
            position_num,
            position_name,
            staff:staff_num (first_name, last_name)
          `
          )
          .eq("position_name", "Charge Nurse");

        if (error) {
          console.error("Error fetching charge nurses:", error);
        } else {
          const formattedChargeNurses = data.map((position) => ({
            fullName: `${position.staff.first_name} ${position.staff.last_name}`,
            positionNum: position.position_num,
          }));
          setChargeNurses(formattedChargeNurses);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchChargeNurses();
  }, []);

  useEffect(() => {
    const fetchAppointmentNum = async () => {
      if (selectedPatientNum) {
        try {
          console.log(
            "Fetching appointment number for patient:",
            selectedPatientNum
          );

          const { data, error } = await supabase
            .from("waiting_list")
            .select("appointment_num")
            .eq("patient_num", selectedPatientNum)
            .limit(1)
            .single();

          if (error) {
            console.error("Error fetching appointment number:", error);
          } else if (data) {
            console.log("Fetched appointment number data:", data);
            setAppointmentNum(data.appointment_num);
          } else {
            console.warn(
              "No appointment number found for patient:",
              selectedPatientNum
            );
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchAppointmentNum();
  }, [selectedPatientNum]);

  useEffect(() => {
    const fetchPatientNum = async () => {
      try {
        const { data, error } = await supabase
          .from("patient")
          .select("patient_num")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching patient number:", error);
        } else {
          setPatientNum(data.patient_num);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchPatientNum();
  }, []);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("position")
          .select(
            `
            position_name,
            staff:staff_num (staff_num, first_name, last_name)
          `
          )
          .in("position_name", [
            "Consultant",
            "Personnel Officer",
            "Staff Nurse",
            "Nurse",
          ]);

        if (error) {
          console.error("Error fetching staff members:", error);
          return;
        }

        console.log("Fetched staff members:", data); // Log fetched data

        const formattedStaffMembers = data.flatMap((position) => {
          const staffMember = position.staff;

          if (!staffMember) {
            return []; // Return empty array if staff member is not available
          }

          // If staff member is an object, directly map it
          return {
            fullName: `${staffMember.first_name} ${staffMember.last_name}`,
            staffNum: staffMember.staff_num,
          };
        });

        console.log("Formatted staff members:", formattedStaffMembers); // Log formatted data

        setStaffMembers(formattedStaffMembers); // Set state here
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchStaffMembers();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch patient numbers from waiting_list
        const { data: waitingListData, error: waitingListError } =
          await supabase.from("waiting_list").select("patient_num");

        if (waitingListError) {
          throw waitingListError;
        }

        // Extract patient numbers from waitingListData
        const patientNumbers = waitingListData.map((row) => row.patient_num);

        // Fetch patients from Patient table, concatenate first_name and last_name
        const { data: patientsData, error: patientsError } = await supabase
          .from("patient")
          .select(
            `
            patient_num,
            first_name,
            last_name
          `
          )
          .in("patient_num", patientNumbers);

        if (patientsError) {
          throw patientsError;
        }

        // Concatenate first_name and last_name and map to options
        const patientOptions = patientsData.map((patient) => ({
          fullName: `${patient.first_name} ${patient.last_name}`,
          patientNum: patient.patient_num,
        }));

        setPatients(patientOptions);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientNum) {
      const fetchAppointmentNum = async () => {
        try {
          const { data, error } = await supabase
            .from("waiting_list")
            .select("appointment_num")
            .eq("patient_num", selectedPatientNum)
            .single();

          if (error) {
            console.error("Error fetching appointment number:", error);
          } else {
            setAppointmentNum(data.appointment_num);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      };

      fetchAppointmentNum();
    }
  }, [selectedPatientNum]);

  // Handler for form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "patientName") {
      const selectedPatient = patients.find(
        (patient) => patient.fullName === value
      );
      setSelectedPatientNum(
        selectedPatient ? selectedPatient.patientNum : null
      );
    }
  };

  // Handler for inserting data into PostgreSQL via Supabase
  const handleInsert = async () => {
    try {
      const selectedChargeNurse = chargeNurses.find(
        (nurse) => nurse.fullName === formData.chargeNurseFullName
      );

      if (!selectedChargeNurse) {
        console.error("Selected charge nurse not found.");
        alert("Selected charge nurse not found.");
        return;
      }

      const { data: chargeNurseData, error: chargeNurseError } = await supabase
        .from("charge_nurse")
        .insert([
          {
            position_num: selectedChargeNurse.positionNum,
            staff_num,
            full_name: formData.chargeNurseFullName,
          },
        ])
        .select("cn_num")
        .single();

      if (chargeNurseError) {
        throw chargeNurseError;
      }

      const cnNum = chargeNurseData.cn_num;

      // Insert data into 'wards' table
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .insert([
          {
            cn_num: cnNum,
            ward_name: formData.wardName,
            location: formData.location,
            telephone_ext_num: formData.telephoneExtensionNumber,
          },
        ])
        .select("ward_num")
        .single();

      if (wardsError) {
        throw wardsError;
      }

      const wardNum = wardsData.ward_num;

      // Fetch staff_num of selected staff member
      const selectedStaff = staffMembers.find(
        (staff) => staff.fullName === formData.staffAssigned
      );

      if (!selectedStaff) {
        console.error("Selected staff member not found.");
        alert("Selected staff member not found.");
        return;
      }

      // Insert data into 'staff_assigned_to_ward' table
      const { data: staffAssignedData, error: staffAssignedError } =
        await supabase
          .from("staff_assigned_to_ward")
          .insert([
            {
              staff_num: selectedStaff.staffNum,
              ward_num: wardNum,
              full_name: formData.staffAssigned,
              shift: formData.shift,
            },
          ])
          .select("sw_num")
          .single();

      if (staffAssignedError) {
        throw staffAssignedError;
      }

      const staffAssignedNum = staffAssignedData.sw_num;

      // Fetch patient_num of selected patient
      const selectedPatient = patients.find(
        (patient) => patient.fullName === formData.patientName
      );

      if (!selectedPatient) {
        console.error("Selected patient not found.");
        alert("Selected patient not found.");
        return;
      }

      const selectedPatientNum = selectedPatient.patientNum;

      // Insert data into 'In_Patient' table
      const { data: inPatientsData, error: inPatientsError } = await supabase
        .from("in_patient")
        .insert([
          {
            appointment_num: appointmentNum,
            patient_num: selectedPatientNum,
            staff_num: selectedStaff.staffNum,
            ward_num: wardNum,
            date_placed_on_waiting_list: formData.datePlacedOnWaitingList,
            expected_duration_of_stay: formData.expectedDurationOfStay,
            date_placed_in_ward: formData.datePlacedInWards,
            date_of_expected_leave: formData.dateOfExpectedLeave,
            date_of_actual_leave: formData.dateOfActualLeave,
          },
        ])
        .select("bed_num")
        .single();

      if (inPatientsError) {
        throw inPatientsError;
      }

      const bedNum = inPatientsData.bed_num;

      // Insert data into 'patient_medication' table
      const { data: patientMedicationData, error: patientMedicationError } =
        await supabase
          .from("patient_medication")
          .insert([
            {
              patient_num: selectedPatientNum,
              ward_num: wardNum,
              units_per_day: formData.unitsPerDay,
              med_start: formData.medStart,
              med_finish: formData.medFinish,
            },
          ])
          .select("pm_num")
          .single();

      if (patientMedicationError) {
        throw patientMedicationError;
      }

      const pmNum = patientMedicationData.pm_num;

      // Insert data into 'Ward_Requisition' table
      const { data: wardsRequisitionsData, error: wardsRequisitionsError } =
        await supabase
          .from("ward_requisition")
          .insert([
            {
              staff_num,
              ward_num: wardNum,
              date_ordered: formData.dateOrdered,
            },
          ])
          .select("requisition_num")
          .single();

      if (wardsRequisitionsError) {
        throw wardsRequisitionsError;
      }

      const requisitionNum = wardsRequisitionsData.requisition_num;

      // Handle success scenario after all insertions
      console.log("Selected Patient Num:", selectedPatientNum);
      alert("Data inserted successfully");
      // Optionally reset form fields here
    } catch (error) {
      console.error("Error inserting data:", error.message);
      // Handle error scenarios
    }
  };

  const handleUpdate = async () => {};
  const handleDelete = async () => {};

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
          <ExpandableForm title="Charge Nurse">
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="chargeNurseFullName-label">Full Name</InputLabel>
              <Select
                labelId="chargeNurseFullName-label"
                name="chargeNurseFullName"
                value={formData.chargeNurseFullName}
                onChange={handleChange}
                label="Full Name"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {chargeNurses.map((nurse) => (
                  <MenuItem key={nurse.positionNum} value={nurse.fullName}>
                    {nurse.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ExpandableForm>

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
                  <MenuItem value="General Ward">General Ward</MenuItem>
                  <MenuItem value="Intensive Care Unit">
                    Intensive Care Unit
                  </MenuItem>
                  <MenuItem value="Nursery Ward">Nursery Ward</MenuItem>
                  <MenuItem value="Emergency Ward">Emergency Ward</MenuItem>
                  <MenuItem value="Psychiatric Ward">Psychiatric Ward</MenuItem>
                  <MenuItem value="ICU Ward">ICU Ward</MenuItem>
                  <MenuItem value="Burns Ward">Burns Ward</MenuItem>
                  <MenuItem value="Postoperative Ward">
                    Postoperative Ward
                  </MenuItem>
                  <MenuItem value="Postnatal Ward">Postnatal Ward</MenuItem>
                  <MenuItem value="Special Septic Ward">
                    Special Septic Ward
                  </MenuItem>
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
                  <MenuItem value="Block A">Block A</MenuItem>
                  <MenuItem value="Block B">Block B</MenuItem>
                  <MenuItem value="Block C">Block C</MenuItem>
                  <MenuItem value="Block D">Block D</MenuItem>
                  <MenuItem value="Block E">Block E</MenuItem>
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

          <ExpandableForm title="Staff Assigned To Wards">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="staff-assigned-label">Staff Name</InputLabel>
                <Select
                  labelId="staff-assigned-label"
                  name="staffAssigned"
                  value={formData.staffAssigned}
                  onChange={handleChange}
                  label="Staff Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {staffMembers.map((staff) => (
                    <MenuItem key={staff.staffNum} value={staff.fullName}>
                      {staff.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="shift-label">Shift</InputLabel>
                <Select
                  labelId="shift-label"
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
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
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="patient-name-label">Patient Name</InputLabel>
                <Select
                  labelId="patient-name-label"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  label="Patient Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {patients.map((patient) => (
                    <MenuItem key={patient.patientNum} value={patient.fullName}>
                      {patient.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                value={formData.datePlacedOnWaitingList}
                onChange={handleChange}
              />
              <TextField
                label="Expected Duration Of Stay"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="expectedDurationOfStay"
                value={formData.expectedDurationOfStay}
                onChange={handleChange}
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
                value={formData.datePlacedInWards}
                onChange={handleChange}
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
                value={formData.dateOfExpectedLeave}
                onChange={handleChange}
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
                value={formData.dateOfActualLeave}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Patient Medications">
            <form>
              <TextField
                label="Units Per Day"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="unitsPerDay"
                value={formData.unitsPerDay}
                onChange={handleChange}
              />
              <TextField
                label="Start of Medication"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="medStart"
                value={formData.medStart}
                onChange={handleChange}
              />
              <TextField
                label="Finish of Medication"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                name="medFinish"
                value={formData.medFinish}
                onChange={handleChange}
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
                value={formData.dateOrdered}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <div style={{ display: "flex", marginBottom: "20px" }}>
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
              onClick={handleUpdate}
            >
              Update
            </Button>
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wards;
