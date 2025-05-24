import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Alert,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useCreateCustomerUserMutation } from '../../store/api/userApi';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSwitchToSalonSignup: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ 
  open, 
  onClose, 
  onSwitchToLogin,
  onSwitchToSalonSignup 
}) => {
  const [createUser, {isLoading} ] = useCreateCustomerUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeToTerms) return 'You must agree to the terms and conditions';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        userName: formData.email.trim().split('@')[0],
        password: formData.password,
        gender: formData.gender as 'MALE' | 'FEMALE'
      };

      await createUser(userData).unwrap();
      setSuccess(true);
      
      // Redirect to login after successful signup
      setTimeout(() => {
        handleClose();
        onSwitchToLogin();
      }, 2000);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.data?.errors) {
        // Handle validation errors from backend
        const details = error.data.errors;
        const errorMessages = Object.values(details).join(', ');
        setError(errorMessages);
      } else if (error.data?.detail) {
        setError(error.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      gender: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Poppins, sans-serif' }}>
            Create Account
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Account created successfully! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
                placeholder="John"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
                placeholder="Doe"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            placeholder="john@example.com"
            sx={{ mb: 2 }}
          />

          
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            value={formData.gender}
            onChange={handleChange('gender')}
          >
            <FormControlLabel value="MALE" control={<Radio />} label="Male" />
            <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>

         <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            required
            placeholder="Create a strong password"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            placeholder="Confirm your password"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={handleChange('agreeToTerms')}
                required
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link 
                  href="#" 
                  color="primary"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Terms & Conditions
                </Link>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || success}
            sx={{ 
              py: 1.5, 
              fontWeight: 600,
              fontSize: '1rem',
              mb: 3,
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToLogin}
                sx={{ 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Sign in
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Want to list your salon?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToSalonSignup}
                sx={{ 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  color: 'secondary.main',
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Become a Partner
              </Link>
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
