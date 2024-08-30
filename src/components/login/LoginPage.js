import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { login, fetchUsers } from '../service/authService';
import "./LoginPage.css";
import Input from "../CommonUI/Input";
import Button from "../CommonUI/Button";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
      case "email":
        newErrors.email = validateEmail(value) ? "" : "Invalid email address";
        break;
      case "password":
        newErrors.password = validatePassword(value) ? "" : "Password must be at least 8 characters long and contain both letters and numbers";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    validateField(name, value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const errorMessage = {};
    if (!email) errorMessage.email = "Email is required";
    if (!password) {
      errorMessage.password = "Password is required";
    }

    if (Object.keys(errorMessage).length > 0) {
      setErrors(errorMessage);
      return;
    }

    setErrors({});

    if (loading) return;

    setLoading(true);

    try {
      const { token } = await login(email, password);

      localStorage.setItem('authToken', token);
      const users = await fetchUsers();
      const user = users.find(user => user.email === email);
      const userData = email;

      if (user) {
        if (user.password !== password) {
          setErrors({ password: "Invalid Password" });
          return;
        } 
         
        setDialogType('success');
        localStorage.setItem('user', userData);
        navigate('/dashboard');
      } else {
        setDialogType('error');
        setDialogOpen(true);
      }
    } catch (err) {
      setDialogType('error');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = () => {
    navigate("/registration");
  };

  return (
    <div className="login-page">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label>Password: </label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
       
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="btn button-secondary"
          onClick={handleRegistration}
        >
          Register
        </Button>
        <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {dialogType === 'success' ? 'Login Successful !!' : 'Login failed. Please check your credentials and try again.'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </form>
    </div>
  );
};

export default LoginPage;