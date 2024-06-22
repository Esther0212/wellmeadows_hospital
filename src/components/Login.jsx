import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../components/supabase";
import { useUser } from "../contexts/userContext";
import "./Login.css";

const Login = () => {
  const { setUser } = useUser();
  const [staffNumber, setStaffNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Check if the staff_num and password match in the 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("staff_num", staffNumber)
        .eq("password", password)
        .single();

      if (userError || !userData) {
        alert("Staff Number and Password do not match");
        setStaffNumber("");
        setPassword("");
        return;
      }

      // Check if the staff_num exists in the 'staff' table and get the first_name and last_name
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("first_name, last_name")
        .eq("staff_num", staffNumber)
        .single();

      if (staffError || !staffData) {
        alert("Staff Number not found in staff table");
        setStaffNumber("");
        setPassword("");
        return;
      }

      // Update the user context with the authenticated user data
      setUser({ ...userData });

      // Redirect to dashboard upon successful login and pass staff_num, first_name, and last_name
      navigate("/dashboard", {
        state: {
          staff_num: userData.staff_num,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
        },
      });
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="welcome-message">WELCOME TO WELLMEADOWS HOSPITAL!</h1>
      <div className="signup-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="staffNumber">Staff Number</label>
            <input
              type="text"
              id="staffNumber"
              name="staffNumber"
              placeholder="Enter staff number"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="login-button">
            LOGIN
          </button>
          <div className="signup-text">
            Not registered yet?{" "}
            <Link to="/signup" className="signup-link">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
