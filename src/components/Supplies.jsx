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

const Supplies = () => {
  const location = useLocation();
  const { staff_num, first_name, last_name } = location.state || {};

  // State for dropdowns and text fields
  const [formData, setFormData] = useState({
    supplierName: "",
    address: "",
    telephoneNumber: "",
    faxNumber: "",
    supplyType: "",
    supplyName: "",
    supplyDescription: "",
    quantityInStock: "",
    reorderLevel: "",
    costPerUnit: "",
    dosage: "",
    administrationMethod: "",
    quantityOrdered: "",
  });

  // Handler for form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for dropdown change
  const handlePositionChange = (event, fieldName) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
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
            Supplies
          </h2>

          {/* Example of using ExpandableForm */}
          <ExpandableForm title="Suppliers">
            <form>
              <TextField
                label="Supplier Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="supplierName"
                value={formData.supplierName}
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
                label="Telephone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
              />
              <TextField
                label="Fax Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="faxNumber"
                value={formData.faxNumber}
                onChange={handleChange}
              />
            </form>
          </ExpandableForm>

          <ExpandableForm title="Supply">
            <form>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="supplyType-label">Supply Type</InputLabel>
                <Select
                  labelId="supplyType-label"
                  name="supplyType"
                  value={formData.supplyType}
                  onChange={(e) => handlePositionChange(e, "supplyType")}
                  label="Supply Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Item">Item</MenuItem>
                  <MenuItem value="Drug">Drug</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Supply Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="supplyName"
                value={formData.supplyName}
                onChange={handleChange}
              />
              <TextField
                label="Supply Description"
                variant="outlined"
                fullWidth
                margin="normal"
                name="supplyDescription"
                value={formData.supplyDescription}
                onChange={handleChange}
              />
              <TextField
                label="Quantity In Stock"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="quantityInStock"
                value={formData.quantityInStock}
                onChange={handleChange}
              />
              <TextField
                label="Reorder Level"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
              />
              <TextField
                label="Cost Per Unit"
                variant="outlined"
                fullWidth
                margin="normal"
                name="costPerUnit"
                value={formData.costPerUnit}
                onChange={handleChange}
              />
              <TextField
                label="Dosage"
                variant="outlined"
                fullWidth
                margin="normal"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="administrationMethod-label">
                  Administration Method
                </InputLabel>
                <Select
                  labelId="administrationMethod-label"
                  name="administrationMethod"
                  value={formData.administrationMethod}
                  onChange={(e) =>
                    handlePositionChange(e, "administrationMethod")
                  }
                  label="Administration Method"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Oral">Oral</MenuItem>
                  <MenuItem value="Parenteral">Parenteral</MenuItem>
                  <MenuItem value="Inhalation">Inhalation</MenuItem>
                  <MenuItem value="Sublingual">Sublingual</MenuItem>
                  <MenuItem value="Topical">Topical</MenuItem>
                  <MenuItem value="Otic">Otic</MenuItem>
                  <MenuItem value="Ophthalmic">Ophthalmic</MenuItem>
                </Select>
              </FormControl>
            </form>
          </ExpandableForm>

          <ExpandableForm title="Requisition Supply">
            <form>
              <TextField
                label="Quantity Ordered"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                name="quantityOrdered"
                value={formData.quantityOrdered}
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
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Supplies;
