import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import "./Signup.css";

const SignUp = () => {
  const [staffNumber, setStaffNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value.length < 6) {
      setConfirmPasswordError("Password must be at least 6 characters");
    } else if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data: staffData, error: staffInsertError } = await supabase
        .from("staff")
        .insert([
          {
            staff_num: staffNumber,
            first_name: firstName,
            last_name: lastName,
          },
        ]);

      if (staffInsertError) {
        throw staffInsertError;
      }

      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const { data: userData, error: userInsertError } = await supabase
        .from("users")
        .insert([
          {
            staff_num: staffNumber,
            first_name: firstName,
            last_name: lastName,
            email_address: email,
            password,
          },
        ]);

      if (userInsertError) {
        throw userInsertError;
      }

      setSuccessMessage("Registration successful!");
      setError(null);
      setStaffNumber("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Show alert for successful registration
      window.alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      setError(error.message);
      console.error("Sign up error:", error.message);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <h1 className="welcome-message">WELCOME TO WELLMEADOWS HOSPITAL!</h1>
      <div className="signup-box">
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Enter Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={handleEmailChange}
              className={emailError ? "error" : ""}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              className={passwordError ? "error" : ""}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={confirmPasswordError ? "error" : ""}
            />
            {confirmPasswordError && (
              <p className="error-text">{confirmPasswordError}</p>
            )}
          </div>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="submit" className="signup-button">
            SIGN UP
          </button>
          <div className="login-text">
            <p className="already-account-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
