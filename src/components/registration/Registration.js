import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import Input from "../CommonUI/Input";
import Button from "../CommonUI/Button";
import Dropdown from "../CommonUI/Dropdown";
import { checkDuplicateEmail, registerUser } from '../service/authService';

const RegistrationForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    foodInterest: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    foodInterest: "",
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "firstName":
        newErrors.firstName = value.trim() ? "" : "First name is required";
        break;
      case "lastName":
        newErrors.lastName = value.trim() ? "" : "Last name is required";
        break;
      case "email":
        newErrors.email = validateEmail(value) ? "" : "Invalid email address";
        break;
      case "password":
        newErrors.password = validatePassword(value) ? "" : "Password must be at least 8 characters long and contain both letters and numbers";
        break;
        case "confirmPassword":
        newErrors.confirmPassword = value === formData.password ? "" : "Passwords do not match";
        newErrors.confirmPassword = value.trim() ? "" : "Confirm Password is required";
        break;
      case "foodInterest":
        newErrors.foodInterest = value.trim() ? "" : "Food interest is required";
        break;
      default:
        break;
    }
  
    setErrors(newErrors);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    validateField(name, value);
  };

  const checkDuplicateEmail = async (email) => {
    try {
      const response = await axios.get("http://localhost:3030/users");
      const userExists = response.data.some((user) => user.email === email);
      return userExists;
    } catch (error) {
      console.error("Error fetching users:", error);
      return false;
    }
  };

  const validateFormData = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email || !validateEmail(formData.email)) errors.email = "Invalid email address";
    if (!formData.password || !validatePassword(formData.password)) errors.password = "Password must be at least 8 characters long and contain both letters and numbers";
    if (!formData.confirmPassword) errors.confirmPassword = "Confirm Password is required";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!formData.foodInterest.trim()) errors.foodInterest = "Food interest is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const isValid = validateFormData();
    if (!isValid) return;
 
    setIsSubmitting(true);

    const emailExists = await checkDuplicateEmail(formData.email);
    if (emailExists) {
      setError("Email already exists.");
      setDialogType('error');
      setIsSubmitting(false);
      return;
    }

 if(formData){
  try {
    await registerUser(formData);
    localStorage.setItem('user', `${formData.email}`);
    
    setDialogType('success');
    setDialogOpen(true);
    navigate("/dashboard");
  } catch (err) {
    setDialogType('error');
    setError(err.response?.data?.message || "An error occurred");
  } finally {
    setIsSubmitting(false);
  }
 } else {
  setDialogType('error');
 }
   
  };

  return (
    <form className="registration-page" onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
      </div>

      <div>
        <label>Last Name:</label>
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
      </div>

      <div>
        <label>Email:</label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div>
        <label>Password:</label>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>

      <div>
        <label>Confirm Password:</label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
      </div>

      <div>
        <label>Food Interest:</label>
        <Dropdown
          name="foodInterest"
          value={formData.foodInterest}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.foodInterest && <p style={{ color: "red" }}>{errors.foodInterest}</p>}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {dialogType === 'success' ? 'Registration Successful !!' : 'Blank fields are not acceptable. Please try again'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Button type="submit" className="btn button-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
