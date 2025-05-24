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
  Stepper,
  Step,
  StepLabel,
  Alert,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useCreateSalonMutation } from '../../store/api/salonApi';



interface SalonSignupModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = ['Personal Info', 'Salon Details'];

const SalonSignupModal: React.FC<SalonSignupModalProps> = ({ open, onClose }) => {
  const [createSalon, { isLoading }] = useCreateSalonMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    // User Info
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '' as 'MALE' | 'FEMALE' | '',
    
    // Salon Details
    salonName: '',
    openTime: '',
    closeTime: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    zipcode: '',
    salonEmail: '',
    contactNumber: '',
  });

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages(Array.from(files));
      setError(null);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Personal Info
        if (!formData.firstName.trim()) return 'First name is required';
        if (!formData.lastName.trim()) return 'Last name is required';
        if (!formData.userName.trim()) return 'Username is required';
        if (!formData.email.trim()) return 'Email is required';
        if (formData.password.length < 8) return 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        if (!formData.gender) return 'Gender is required';
        break;
      
      case 1: // Salon Details
        if (!formData.salonName.trim()) return 'Salon name is required';
        if (!formData.openTime.trim()) return 'Open time is required';
        if (!formData.closeTime.trim()) return 'Close time is required';
        if (!formData.address.trim()) return 'Address is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.state.trim()) return 'State is required';
        if (!formData.zipcode.trim()) return 'Zipcode is required';
        if (!formData.salonEmail.trim()) return 'Salon email is required';
        if (!formData.contactNumber.trim()) return 'Contact number is required';
        break;
      
      default:
        return null;
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep(activeStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    const validationError = validateStep(1);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const salonData = {
        salonName: formData.salonName.trim(),
        openTime: formData.openTime.trim(),
        closeTime: formData.closeTime.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipcode: formData.zipcode.trim(),
        email: formData.salonEmail.trim(),
        contactNumber: formData.contactNumber.trim(),
        user: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          gender: formData.gender as 'MALE' | 'FEMALE',
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append('salon', new Blob([JSON.stringify(salonData)], { type: 'application/json' }));
      images.forEach((image) => formDataToSend.append('images', image));

      await createSalon({ salon: salonData, images }).unwrap();
      setSuccess(true);
      
      // Close modal after successful submission
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error: any) {
      console.error('Salon signup error:', error);
        
      if (error.data?.errors) {
        // Handle validation errors from backend
        const details = error.data.errors;
        const errorMessages = Object.values(details).join(', ');
        setError(errorMessages);
      } else if (error.data?.detail) {
        setError(error.data.detail);
      } else  {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      salonName: '',
      openTime: '',
      closeTime: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      zipcode: '',
      salonEmail: '',
      contactNumber: '',
    });
    setImages([]);
    setActiveStep(0);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6}}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 6}}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Username"
              value={formData.userName}
              onChange={handleChange('userName')}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
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
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
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
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Salon Details
            </Typography>
            <TextField
              fullWidth
              label="Salon Name"
              value={formData.salonName}
              onChange={handleChange('salonName')}
              required
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6}}>
                <TextField
                  fullWidth
                  label="Open Time"
                  value={formData.openTime}
                  onChange={handleChange('openTime')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 6}}>
                <TextField
                  fullWidth
                  label="Close Time"
                  value={formData.closeTime}
                  onChange={handleChange('closeTime')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              required
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Landmark"
              value={formData.landmark}
              onChange={handleChange('landmark')}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 4}}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleChange('city')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 4}}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={handleChange('state')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 4}}>
                <TextField
                  fullWidth
                  label="Zipcode"
                  value={formData.zipcode}
                  onChange={handleChange('zipcode')}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Salon Email"
              type="email"
              value={formData.salonEmail}
              onChange={handleChange('salonEmail')}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange('contactNumber')}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload Salon Images (Optional)
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {images.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {images.length} image(s) selected
                </Typography>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
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
            Become a Partner
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! Your application is under review. We'll contact you within 24-48 hours.
          </Alert>
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent:'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoading || success}
              sx={{ fontWeight: 600 }}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              variant="contained"
              sx={{ fontWeight: 600 }}
            >
              Next Step
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SalonSignupModal;