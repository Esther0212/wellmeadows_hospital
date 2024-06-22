import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidePanel from "../globalcomponents/SidePanel";
import TopPanel from "../globalcomponents/TopPanel";
import ExpandableForm from "./ExpandableForm";
import { supabase } from "./supabase"; // Adjust the import path as per your project
import defaultUserImage from "../images/default_user.png";
import "./ExpandableForm.css";
import "./Profile.css";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const Profile = () => {
  const location = useLocation();
  const { staff_num, first_name, last_name } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullAddress: "",
    telephoneNumber: "",
    dateOfBirth: "",
    sex: "",
    nin: "",
    hoursWorkedPerWeek: "",
    contractType: "",
    salaryPaymentType: "",
    positionName: "",
    currentSalary: "",
    salaryScale: "",
    qualificationType: "",
    qualificationDate: "",
    institutionName: "",
    previousPosition: "",
    startDate: "",
    finishDate: "",
    organizationName: "",
    avatarImage: "",
  });

  const [avatarUrl, setAvatarUrl] = useState(defaultUserImage); // Default to defaultUserImage if no avatar

  useEffect(() => {
    if (staff_num) {
      fetchStaffDetails(staff_num);
    }
  }, [staff_num]);

  const fetchStaffDetails = async (staffNumber) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, avatar_image")
        .eq("staff_num", staffNumber)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData((prevState) => ({
          ...prevState,
          firstName: data.first_name,
          lastName: data.last_name,
        }));

        if (data.avatar_image) {
          const { publicURL, error: urlError } = supabase.storage
            .from("avatars")
            .getPublicUrl(data.avatar_image);

          if (urlError) {
            throw urlError;
          }

          setAvatarUrl(publicURL);
        } else {
          setAvatarUrl(defaultUserImage); // fallback to default image if no avatar is found
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setAvatarUrl(defaultUserImage); // fallback to default image on error
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result); // Temporary URL for preview
      };
      reader.readAsDataURL(file);
      setFormData((prevState) => ({
        ...prevState,
        avatarImage: file,
      }));
    } else {
      setAvatarUrl(defaultUserImage);
      setFormData((prevState) => ({
        ...prevState,
        avatarImage: null,
      }));
    }
  };

  const handleInsert = async () => {
    try {
      let avatarUrl = null;
      if (formData.avatarImage) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(
            `${staff_num}/${formData.avatarImage.name}`,
            formData.avatarImage
          );

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL of the uploaded file
        avatarUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadData.path).publicURL;

        // Update user's avatar_image field with the storage path
        const { data: updateUserData, error: updateUserError } = await supabase
          .from("users")
          .update({ avatar_image: `${staff_num}/${formData.avatarImage.name}` })
          .eq("staff_num", staff_num);

        if (updateUserError) {
          throw updateUserError;
        }

        // Update state with the public URL
        setAvatarUrl(avatarUrl);
      }

      // Insert into position table
      const { data: positionData, error: positionError } = await supabase
        .from("position")
        .insert([
          {
            staff_num,
            position_name: formData.positionName,
            current_salary: formData.currentSalary,
            salary_scale: formData.salaryScale,
          },
        ]);

      if (positionError) {
        throw positionError;
      }

      // Insert into Qualifications table
      const { data: qualificationData, error: qualificationError } =
        await supabase.from("qualifications").insert([
          {
            staff_num,
            qualification_type: formData.qualificationType,
            qualification_date: formData.qualificationDate,
            institution_name: formData.institutionName,
          },
        ]);

      if (qualificationError) {
        throw qualificationError;
      }

      // Insert into WorkExperience table
      const { data: workExpData, error: workExpError } = await supabase
        .from("workexperience")
        .insert([
          {
            staff_num,
            previous_position: formData.previousPosition,
            start_date: formData.startDate,
            finish_date: formData.finishDate,
            organization_name: formData.organizationName,
          },
        ]);

      if (workExpError) {
        throw workExpError;
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
            Profile
          </h2>

          <div className="avatar-container">
            <img
              src={avatarUrl || defaultUserImage}
              alt="User Avatar"
              className="user-avatar"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                marginLeft: "44%",
                marginRight: "40%",
                marginBottom: "30px",
              }}
            />
          </div>
          <div className="file-upload-container">
            <label htmlFor="avatar-upload" className="custom-file-upload">
              UPLOAD AVATAR
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                name="avatarImage"
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the default file input
              />
            </label>
          </div>

          {/* Example of using ExpandableForm */}
          <ExpandableForm
            title="Staff"
            formData={formData}
            handleChange={handleChange}
          >
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
                label="Full Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="fullAddress"
                value={formData.fullAddress}
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
              <TextField
                label="NIN"
                variant="outlined"
                fullWidth
                margin="normal"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm
            title="Contract"
            formData={formData}
            handleChange={handleChange}
          >
            <form>
              <TextField
                label="Hours Worked Per Week"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="hoursWorkedPerWeek"
                value={formData.hoursWorkedPerWeek}
                onChange={handleChange}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="contractType-label">Contract Type</InputLabel>
                <Select
                  labelId="contractType-label"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  label="Contract Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="salaryPaymentType-label">
                  Salary Payment Type
                </InputLabel>
                <Select
                  labelId="salaryPaymentType-label"
                  name="salaryPaymentType"
                  value={formData.salaryPaymentType}
                  onChange={handleChange}
                  label="Salary Payment Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </form>
          </ExpandableForm>

          <ExpandableForm
            title="Position"
            formData={formData}
            handleChange={handleChange}
          >
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="positionName-label">Position Name</InputLabel>
                <Select
                  labelId="positionName-label"
                  name="positionName"
                  value={formData.positionName}
                  onChange={handleChange}
                  label="Position Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Medical Director">Medical Director</MenuItem>
                  <MenuItem value="Charge Nurse">Charge Nurse</MenuItem>
                  <MenuItem value="Consultant">Consultant</MenuItem>
                  <MenuItem value="Personnel Officer">
                    Personnel Officer
                  </MenuItem>
                  <MenuItem value="Staff Nurse">Staff Nurse</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Current Salary"
                variant="outlined"
                fullWidth
                margin="normal"
                name="currentSalary"
                type="number"
                value={formData.currentSalary}
                onChange={handleChange}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="salaryScale-label">Salary Scale</InputLabel>
                <Select
                  labelId="salaryScale-label"
                  name="salaryScale"
                  value={formData.salaryScale}
                  onChange={handleChange}
                  label="Salary Scale"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="1A scale">1A scale</MenuItem>
                  <MenuItem value="2A scale">2A scale</MenuItem>
                  <MenuItem value="1B scale">1B scale</MenuItem>
                  <MenuItem value="2B scale">2B scale</MenuItem>
                  <MenuItem value="1C scale">1C scale</MenuItem>
                  <MenuItem value="2C scale">2C scale</MenuItem>
                </Select>
              </FormControl>
            </form>
          </ExpandableForm>

          <ExpandableForm
            title="Qualifications"
            formData={formData}
            handleChange={handleChange}
          >
            <form>
              <TextField
                label="Qualification Type"
                variant="outlined"
                fullWidth
                margin="normal"
                name="qualificationType"
                value={formData.qualificationType}
                onChange={handleChange}
              />
              <TextField
                label="Qualification Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="qualificationDate"
                value={formData.qualificationDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Institution Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm
            title="Work Experience"
            formData={formData}
            handleChange={handleChange}
          >
            <form>
              <TextField
                label="Previous Position"
                variant="outlined"
                fullWidth
                margin="normal"
                name="previousPosition"
                value={formData.previousPosition}
                onChange={handleChange}
              />
              <TextField
                label="Start Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Finish Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="finishDate"
                value={formData.finishDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Organization Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
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

export default Profile;
