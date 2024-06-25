import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidePanel from "../globalcomponents/SidePanel";
import TopPanel from "../globalcomponents/TopPanel";
import { PositionContext } from "../contexts/PositionContext";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";

const Staff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPositionNum } = useContext(PositionContext);
  const { position_num, staff_num, first_name, last_name } =
    location.state || {};

  const [staffData, setStaffData] = useState([]);
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
  });

  const [selectedStaffNum, setSelectedStaffNum] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const { data, error } = await supabase.from("staff").select("*");

        if (error) {
          throw error;
        }

        setStaffData(data);
      } catch (error) {
        console.error("Error fetching staff data:", error.message);
      }
    };

    fetchStaffData();
  }, []);

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

      // Insert into Staff table
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_address: formData.fullAddress,
            telephone_num: formData.telephoneNumber,
            date_of_birth: formData.dateOfBirth,
            sex: formData.sex,
            nin: formData.nin,
          },
        ])
        .select("staff_num")
        .single();

      if (staffError) {
        throw staffError;
      }

      const staffNum = staffData.staff_num;

      // Insert into e_contract table
      const { data: contractData, error: contractError } = await supabase
        .from("e_contract")
        .insert([
          {
            staff_num: staffNum,
            hours_worked_per_week: formData.hoursWorkedPerWeek,
            contract_type: formData.contractType,
            salary_payment_type: formData.salaryPaymentType,
          },
        ]);

      if (contractError) {
        throw contractError;
      }

      // Insert into position table
      const { data: positionData, error: positionError } = await supabase
        .from("position")
        .insert([
          {
            staff_num: staffNum,
            position_name: formData.positionName,
            current_salary: formData.currentSalary,
            salary_scale: formData.salaryScale,
          },
        ])
        .select("position_num")
        .single();

      if (positionError) {
        throw positionError;
      }

      const positionNum = positionData.position_num;

      // Insert into Qualifications table
      const { data: qualificationData, error: qualificationError } =
        await supabase.from("qualifications").insert([
          {
            staff_num: staffNum,
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
            staff_num: staffNum,
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

  const columns = [
    {
      width: 150,
      label: "Staff Number",
      dataKey: "staff_num",
    },
    {
      width: 150,
      label: "First Name",
      dataKey: "first_name",
    },
    {
      width: 150,
      label: "Last Name",
      dataKey: "last_name",
    },
    {
      width: 250,
      label: "Full Address",
      dataKey: "full_address",
    },
    {
      width: 150,
      label: "Telephone Number",
      dataKey: "telephone_num",
    },
    {
      width: 150,
      label: "Date of Birth",
      dataKey: "date_of_birth",
    },
    {
      width: 100,
      label: "Sex",
      dataKey: "sex",
    },
    {
      width: 150,
      label: "NIN",
      dataKey: "nin",
    },
  ];

  const handleRowClick = async (row) => {
    try {
      setSelectedStaffNum(row.staff_num);

      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("staff_num", row.staff_num)
        .single();

      if (error) {
        throw error;
      }

      setFormData({
        firstName: data.first_name,
        lastName: data.last_name,
        fullAddress: data.full_address,
        telephoneNumber: data.telephone_num,
        dateOfBirth: data.date_of_birth,
        sex: data.sex,
        nin: data.nin,
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
      });

      const { data: contractData, error: contractError } = await supabase
        .from("e_contract")
        .select("*")
        .eq("staff_num", row.staff_num)
        .single();

      if (contractError) {
        throw contractError;
      }

      const { data: positionData, error: positionError } = await supabase
        .from("position")
        .select("*")
        .eq("staff_num", row.staff_num)
        .single();

      if (positionError) {
        throw positionError;
      }

      const { data: qualificationData, error: qualificationError } =
        await supabase
          .from("qualifications")
          .select("*")
          .eq("staff_num", row.staff_num)
          .single();

      if (qualificationError) {
        throw qualificationError;
      }

      const { data: workExpData, error: workExpError } = await supabase
        .from("workexperience")
        .select("*")
        .eq("staff_num", row.staff_num)
        .single();

      if (workExpError) {
        throw workExpError;
      }

      setFormData((prevState) => ({
        ...prevState,
        hoursWorkedPerWeek: contractData.hours_worked_per_week,
        contractType: contractData.contract_type,
        salaryPaymentType: contractData.salary_payment_type,
        positionName: positionData.position_name,
        currentSalary: positionData.current_salary,
        salaryScale: positionData.salary_scale,
        qualificationType: qualificationData.qualification_type,
        qualificationDate: qualificationData.qualification_date,
        institutionName: qualificationData.institution_name,
        previousPosition: workExpData.previous_position,
        startDate: workExpData.start_date,
        finishDate: workExpData.finish_date,
        organizationName: workExpData.organization_name,
      }));
      console.log("Row clicked:", row);
    } catch (error) {
      console.error("Error fetching staff details:", error.message);
    }
  };

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? "right" : "left"}
            style={{
              width: column.width,
              backgroundColor: "#029DEF",
              fontWeight: "bold",
            }}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            onClick={() => handleRowClick(row)}
            align={column.numeric || false ? "right" : "left"}
            sx={{ py: 1 }} // Adjust padding here (py: 1 for example)
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  const handleUpdate = async () => {
    if (!selectedStaffNum) {
      alert("Please select a staff member to update.");
      return;
    }

    try {
      const { error: staffError } = await supabase
        .from("staff")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_address: formData.fullAddress,
          telephone_num: formData.telephoneNumber,
          date_of_birth: formData.dateOfBirth,
          sex: formData.sex,
          nin: formData.nin,
        })
        .eq("staff_num", selectedStaffNum);

      if (staffError) {
        throw staffError;
      }

      const { error: contractError } = await supabase
        .from("e_contract")
        .update({
          hours_worked_per_week: formData.hoursWorkedPerWeek,
          contract_type: formData.contractType,
          salary_payment_type: formData.salaryPaymentType,
        })
        .eq("staff_num", selectedStaffNum);

      if (contractError) {
        throw contractError;
      }

      const { error: positionError } = await supabase
        .from("position")
        .update({
          position_name: formData.positionName,
          current_salary: formData.currentSalary,
          salary_scale: formData.salaryScale,
        })
        .eq("staff_num", selectedStaffNum);

      if (positionError) {
        throw positionError;
      }

      const { error: qualificationError } = await supabase
        .from("qualifications")
        .update({
          qualification_type: formData.qualificationType,
          qualification_date: formData.qualificationDate,
          institution_name: formData.institutionName,
        })
        .eq("staff_num", selectedStaffNum);

      if (qualificationError) {
        throw qualificationError;
      }

      const { error: workExpError } = await supabase
        .from("workexperience")
        .update({
          previous_position: formData.previousPosition,
          start_date: formData.startDate,
          finish_date: formData.finishDate,
          organization_name: formData.organizationName,
        })
        .eq("staff_num", selectedStaffNum);

      if (workExpError) {
        throw workExpError;
      }

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error.message || error);
    }
  };

  const handleDelete = async () => {
    if (!selectedStaffNum) {
      alert("Please select a staff member to delete.");
      return;
    }

    try {
      // Delete from 'workexperience'
      const { data: workExpData, error: workExpError } = await supabase
        .from("workexperience")
        .delete()
        .eq("staff_num", selectedStaffNum);

      if (workExpError) {
        throw workExpError;
      }

      // Delete from 'qualifications'
      const { data: qualificationsData, error: qualificationsError } =
        await supabase
          .from("qualifications")
          .delete()
          .eq("staff_num", selectedStaffNum);

      if (qualificationsError) {
        throw qualificationsError;
      }

      // Delete from 'position'
      const { data: positionData, error: positionError } = await supabase
        .from("position")
        .delete()
        .eq("staff_num", selectedStaffNum);

      if (positionError) {
        throw positionError;
      }

      // Delete from 'e_contract'
      const { data: eContractData, error: eContractError } = await supabase
        .from("e_contract")
        .delete()
        .eq("staff_num", selectedStaffNum);

      if (eContractError) {
        throw eContractError;
      }

      // Finally, delete from 'staff'
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .delete()
        .eq("staff_num", selectedStaffNum);

      if (staffError) {
        throw staffError;
      }

      alert("Staff and related records deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting staff and related records:",
        error.message || error
      );
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
            Staff
          </h2>

          <Paper style={{ height: 300, width: "89.5%", margin: "5%" }}>
            <TableVirtuoso
              data={staffData}
              components={VirtuosoTableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={rowContent}
            />
          </Paper>

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
                backgroundColor: "#00A86B",
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
                backgroundColor: "#DC2941",
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

export default Staff;
