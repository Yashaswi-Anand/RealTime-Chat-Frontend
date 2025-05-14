import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { loginUser, registerUser } from '../utils/auth';
// import { getSocket } from '../utils/socket';
import { useNavigate } from 'react-router-dom';

const RegisterLoginForm = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formType === 'register' ? await registerUser(formData) : loginUser(formData);
      alert(`${formType === 'register' ? 'Registered' : 'Logged in'} successfully!`);

      if (formType === 'login') {
        navigate('/');
      } else {
        alert('Registered successfully!');
      }

    } catch (error) {
      console.error('Error during API call:', error);
      alert(`Error: ${error.response ? error.response.data.message : 'Network error'}`);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          {formType === 'register' ? 'Register' : 'Login'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {formType === 'register' && (
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button variant="contained" type="submit">
              {formType === 'register' ? 'Register' : 'Login'}
            </Button>
            <Typography variant="body2" align="center">
              {formType === 'register'
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Button
                variant="text"
                onClick={() =>
                  setFormType(prev => (prev === 'register' ? 'login' : 'register'))
                }
              >
                {formType === 'register' ? 'Login' : 'Register'}
              </Button>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterLoginForm;