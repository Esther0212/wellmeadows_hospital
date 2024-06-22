import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidePanel from "../globalcomponents/SidePanel";
import TopPanel from "../globalcomponents/TopPanel";
import ExpandableForm from "./ExpandableForm"; // Adjust the import path as per your project
import { supabase } from "./supabase.js"; // Assuming you have initialized Supabase client
import "./ExpandableForm.css";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const Patients = () => {
  const location = useLocation();
  const {
    patient_num,
    clinic_num,
    room_num,
    doctor_num,
    appointment_num,
    staff_num,
    first_name,
    last_name,
  } = location.state || {};

  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    patientAddress: "",
    telephoneNumber: "",
    dateOfBirth: "",
    sex: "",
    maritalStatus: "",
    dateRegistered: "",
    clinicName: "", // Initialize as an empty string
    doctorFullName: "",
    doctorAddress: "",
    doctorTelephone: "",
    roomName: "", // Initialize as an empty string
    dateOfAppointment: "",
    timeOfAppointment: "",
    examResult: "",
    doctorReferralName: "",
    fullName: "",
    relationship: "",
    address: "",
    telephoneNumbers: "",
    registrationDate: "",
    onWaitingList: "",
  });

  useEffect(() => {
    console.log("Location state:", location.state);
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInsert = async () => {
    try {
      console.log("Form Data:", formData);

      // Insert into Patients table
      const { data: patientData, error: patientError } = await supabase
        .from("patient")
        .insert([
          {
            patient_num,
            first_name: formData.firstName,
            last_name: formData.lastName,
            address: formData.patientAddress,
            telephone_num: formData.telephoneNumber,
            date_of_birth: formData.dateOfBirth,
            sex: formData.sex,
            marital_status: formData.maritalStatus,
            date_registered: formData.dateRegistered,
          },
        ]);

      if (patientError) {
        throw patientError;
      }

      // Insert into clinic table
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinic")
        .insert([
          {
            clinic_name: formData.clinicName,
          },
        ]);

      if (clinicError) {
        throw clinicError;
      }

      // Insert into localdoctor table
      const { data: localDoctorData, error: localDoctorError } = await supabase
        .from("localdoctor")
        .insert([
          {
            patient_num,
            clinic_num,
            full_name: formData.doctorFullName,
            address: formData.doctorAddress,
            telephone_num: formData.doctorTelephone,
          },
        ]);

      if (localDoctorError) {
        throw localDoctorError;
      }

      // Insert into e_room table
      const { data: roomData, error: roomError } = await supabase
        .from("e_room")
        .insert([
          {
            room_name: formData.roomName,
          },
        ]);

      if (roomError) {
        throw roomError;
      }

      // Insert into patientappointment table
      const { data: patientAppointmentData, error: patientAppointmentError } =
        await supabase.from("patientappointment").insert([
          {
            patient_num,
            staff_num,
            room_num,
            date_of_appointment: formData.dateOfAppointment,
            time_of_appointment: formData.timeOfAppointment,
            exam_result: formData.examResult,
          },
        ]);

      if (patientAppointmentError) {
        throw patientAppointmentError;
      }

      // Insert into doctorreferral table
      const { data: doctorReferraltData, error: doctorReferralError } =
        await supabase.from("doctor_referral").insert([
          {
            doctor_num,
            appointment_num,
            doctor_referral_name: formData.doctorReferralName,
          },
        ]);

      if (doctorReferralError) {
        throw doctorReferralError;
      }

      // Insert into nextofkin table
      const { data: nextofKinData, error: nextofKinError } = await supabase
        .from("next_of_kin")
        .insert([
          {
            patient_num,
            kin_fullname: formData.fullName,
            relationship: formData.relationship,
            address: formData.address,
            telephone_num: formData.telephoneNumbers,
          },
        ]);

      if (nextofKinError) {
        throw nextofKinError;
      }

      // Insert into outpatient table
      const { data: outpatientData, error: outPatientError } = await supabase
        .from("out_patient")
        .insert([
          {
            appointment_num,
            patient_num,
            registration_date: formData.registrationDate,
          },
        ]);

      if (outPatientError) {
        throw outPatientError;
      }

      // Insert into waitinglist table
      const { data: waitinglistData, error: waitingListError } = await supabase
        .from("waiting_list")
        .insert([
          {
            patient_num,
            appointment_num,
            on_waiting_list: formData.onWaitingList,
          },
        ]);

      if (waitingListError) {
        throw waitingListError;
      }

      alert("Data inserted successfully!");
    } catch (error) {
      console.error("Error inserting data:", error.message || error);
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

        <div className="patients-container">
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              fullWidth: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Patients
          </h2>

          {/* Example of using ExpandableForm */}
          <ExpandableForm title="Patients">
            <form>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="patientAddress"
                value={formData.patientAddress}
                onChange={handleChange}
              />
              <TextField
                label="Telephone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="sex-label">Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  label="Sex"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="marital-status-label">
                  Marital Status
                </InputLabel>
                <Select
                  labelId="marital-status-label"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  label="Marital Status"
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
                label="Date Registered"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="dateRegistered"
                value={formData.dateRegistered}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </ExpandableForm>
          <ExpandableForm title="Local Doctors">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="clinic-name-label">Clinic Name</InputLabel>
                <Select
                  labelId="clinic-name-label"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  label="Clinic Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="General Hospital">General Hospital</MenuItem>
                  <MenuItem value="City Clinic">City Clinic</MenuItem>
                  <MenuItem value="Health Care Center">
                    Health Care Center
                  </MenuItem>
                  <MenuItem value="Medical Associates">
                    Medical Associates
                  </MenuItem>
                  <MenuItem value="Family Clinic">Family Clinic</MenuItem>
                  <MenuItem value="Wellness Clinic">Wellness Clinic</MenuItem>
                  <MenuItem value="Community Health Center">
                    Community Health Center
                  </MenuItem>
                  <MenuItem value="Regional Medical Center">
                    Regional Medical Center
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="doctor-full-name-label">
                  Doctor Full Name
                </InputLabel>
                <Select
                  labelId="doctor-full-name-label"
                  name="doctorFullName"
                  value={formData.doctorFullName}
                  onChange={handleChange}
                  label="Doctor Full Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Dr. Emily Carter, MD">
                    Dr. Emily Carter, MD
                  </MenuItem>
                  <MenuItem value="Dr. Sarah Patel, DDS">
                    Dr. Sarah Patel, DDS
                  </MenuItem>
                  <MenuItem value="Dr. Michael Johnson, DO">
                    Dr. Michael Johnson, DO
                  </MenuItem>
                  <MenuItem value="Dr. Lisa Gomez, MD">
                    Dr. Lisa Gomez, MD
                  </MenuItem>
                  <MenuItem value="Dr. Anthony Nguyen, MD">
                    Dr. Anthony Nguyen, MD
                  </MenuItem>
                  <MenuItem value="Dr. Rachel Lee, MD">
                    Dr. Rachel Lee, MD
                  </MenuItem>
                  <MenuItem value="Dr. Jonathan Smith, MD">
                    Dr. Jonathan Smith, MD
                  </MenuItem>
                  <MenuItem value="Dr. Maria Hernandez, MD">
                    Dr. Maria Hernandez, MD
                  </MenuItem>
                  <MenuItem value="Dr. David Wilson, PhD">
                    Dr. David Wilson, PhD
                  </MenuItem>
                  <MenuItem value="Dr. Angela Kim, DPT">
                    Dr. Angela Kim, DPT
                  </MenuItem>
                  <MenuItem value="Dr. Thomas Brooks, MD">
                    Dr. Thomas Brooks, MD
                  </MenuItem>
                  <MenuItem value="Dr. Olivia White, MD">
                    Dr. Olivia White, MD
                  </MenuItem>
                  <MenuItem value="Dr. Kevin Thompson, MD">
                    Dr. Kevin Thompson, MD
                  </MenuItem>
                  <MenuItem value="Dr. Sophia Martinez, MD">
                    Dr. Sophia Martinez, MD
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Doctor Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="doctorAddress"
                value={formData.doctorAddress}
                onChange={handleChange}
              />
              <TextField
                label="Doctor Telephone"
                variant="outlined"
                fullWidth
                margin="normal"
                name="doctorTelephone"
                value={formData.doctorTelephone}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Patient Appointments">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="room-name-label">Room Name</InputLabel>
                <Select
                  labelId="room-name-label"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleChange}
                  label="Room Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="General Practice">General Practice</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Dentistry">Dentistry</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                  <MenuItem value="Gynecology">Gynecology</MenuItem>
                  <MenuItem value="Pulmonology">Pulmonology</MenuItem>
                  <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                  <MenuItem value="Psychology">Psychology</MenuItem>
                  <MenuItem value="Physical Therapy">Physical Therapy</MenuItem>
                  <MenuItem value="Urology">Urology</MenuItem>
                  <MenuItem value="Oncology">Oncology</MenuItem>
                  <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                  <MenuItem value="Gastroenterology">Gastroenterology</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Date of Appointment"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="dateOfAppointment"
                value={formData.dateOfAppointment}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Time of Appointment"
                variant="outlined"
                fullWidth
                margin="normal"
                type="time"
                name="timeOfAppointment"
                value={formData.timeOfAppointment}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Exam Result"
                variant="outlined"
                fullWidth
                margin="normal"
                name="examResult"
                value={formData.examResult}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>
          <ExpandableForm title="Doctor Referral Name">
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="doctor-referral-name-label">
                Doctor Full Name
              </InputLabel>
              <Select
                labelId="doctor-referral-name-label"
                name="doctorReferralName"
                value={formData.doctorReferralName}
                onChange={handleChange}
                label="Doctor Referral Name"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Dr. Emily Carter, MD">
                  Dr. Emily Carter, MD
                </MenuItem>
                <MenuItem value="Dr. Sarah Patel, DDS">
                  Dr. Sarah Patel, DDS
                </MenuItem>
                <MenuItem value="Dr. Michael Johnson, DO">
                  Dr. Michael Johnson, DO
                </MenuItem>
                <MenuItem value="Dr. Lisa Gomez, MD">
                  Dr. Lisa Gomez, MD
                </MenuItem>
                <MenuItem value="Dr. Anthony Nguyen, MD">
                  Dr. Anthony Nguyen, MD
                </MenuItem>
                <MenuItem value="Dr. Rachel Lee, MD">
                  Dr. Rachel Lee, MD
                </MenuItem>
                <MenuItem value="Dr. Jonathan Smith, MD">
                  Dr. Jonathan Smith, MD
                </MenuItem>
                <MenuItem value="Dr. Maria Hernandez, MD">
                  Dr. Maria Hernandez, MD
                </MenuItem>
                <MenuItem value="Dr. David Wilson, PhD">
                  Dr. David Wilson, PhD
                </MenuItem>
                <MenuItem value="Dr. Angela Kim, DPT">
                  Dr. Angela Kim, DPT
                </MenuItem>
                <MenuItem value="Dr. Thomas Brooks, MD">
                  Dr. Thomas Brooks, MD
                </MenuItem>
                <MenuItem value="Dr. Olivia White, MD">
                  Dr. Olivia White, MD
                </MenuItem>
                <MenuItem value="Dr. Kevin Thompson, MD">
                  Dr. Kevin Thompson, MD
                </MenuItem>
                <MenuItem value="Dr. Sophia Martinez, MD">
                  Dr. Sophia Martinez, MD
                </MenuItem>
              </Select>
            </FormControl>
          </ExpandableForm>

          <ExpandableForm title="Next Of Kin">
            <form>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                label="Relationship"
                variant="outlined"
                fullWidth
                margin="normal"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
              />
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <TextField
                label="Telephone Numbers"
                variant="outlined"
                fullWidth
                margin="normal"
                name="telephoneNumbers"
                value={formData.telephoneNumbers}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Out Patients">
            <form>
              <TextField
                label="Registration Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
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
                name="onWaitingList"
                value={formData.onWaitingList}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </ExpandableForm>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleInsert}
            style={{ margin: "20px auto", display: "block" }}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Patients;
