import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { loginUser, registerUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const RegisterLoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formType, setFormType] = useState('login');
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
      formType === 'register'
        ? await registerUser(formData)
        : await loginUser(formData);

      alert(`${formType === 'register' ? 'Registered' : 'Logged in'} successfully!`);

      if (formType === 'login') {
        navigate('/');
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
      flexDirection={isMobile ? 'column' : 'row'}
      sx={{
        background: 'linear-gradient(135deg, cyan, ghostwhite, tan, lightgreen)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Left Panel: Logo & App Name */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          color: '#fff',
          textAlign: 'center',
          p: 4,
          display: isMobile ? 'none' : 'flex',
        }}
      >
        <Box>
          {/* Logo can be replaced with an image */}
          <Typography variant="h3" fontWeight="bold" mb={2}>
            📸
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Real Insta Chat
          </Typography>
          <Typography variant="subtitle1" mt={2} fontSize={25} fontStyle={'italic'} color="lightblue">
            Chat like never before — simple, stylish, and real-time.
          </Typography>
        </Box>
      </Box>

      {/* Right Panel: Form */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={isMobile ? 2 : 6}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 400,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 3,
            p: isMobile ? 3 : 4,
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            mb={3}
            sx={{
              background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
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
              <Button variant="contained" fullWidth type="submit">
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
    </Box>
  );
};

export default RegisterLoginForm;