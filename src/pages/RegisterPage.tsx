import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required').matches(/^[0-9]{6}$/, 'ZIP code must be 6 digits'),
  preference: yup.string().required('Sport preference is required'),
  gender: yup.string().required('Gender is required')
}).required();

type RegisterFormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData as RegisterData);
      // After successful registration, redirect based on role
      const storedUser = localStorage.getItem('auth_user');
      const newUser = localStorage.getItem('new_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if(newUser === 'yes'){
              navigate('/user/profile')
              return;
          }
          switch (parsed.role) {
            case 'owner':
              navigate('/owner/dashboard');
              return;
            case 'admin':
              navigate('/admin/dashboard');
              return;
            default:
              navigate('/user/dashboard');
              return;
          }
        } catch {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  type Option = { label: string; value: string; id: number };

  const options: Option[] = [
    { label: 'Football', value: 'football', id: 1 },
    { label: 'Cricket', value: 'cricket', id: 2 },
    { label: 'Tennis', value: 'tennis', id: 3 },
    { label: 'Basketball', value: 'basketball', id: 4 },
    { label: 'Badminton', value: 'badminton', id: 5 },
    { label: 'Volleyball', value: 'volleyball', id: 6 },
    { label: 'Karate', value: 'karate', id: 7 },
    { label: 'Multi-sport', value: 'multi-sport', id: 8 }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Logo variant="default" size="medium" />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Join KhelWell
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your Game. Your Journey. All in One Place.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('name')}
                margin="normal"
                fullWidth
                id="name"
                label="Full Name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('phone')}
                margin="normal"
                fullWidth
                id="phone"
                label="Phone Number"
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('email')}
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('password')}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('confirmPassword')}
                margin="normal"
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
               <FormControl component="fieldset" error={!!errors.gender} sx={{ width: '100%' }}>
                  <RadioGroup row aria-label="gender" name="gender" sx={{ gap: 2,textAlign: 'left',display: 'flex',alignItems: "center" }}>
                    <FormControlLabel
                      value="female"
                      control={<Radio {...register('gender', { required: 'Gender is required' })} />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio {...register('gender', { required: 'Gender is required' })} />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio {...register('gender', { required: 'Gender is required' })} />}
                      label="Other"
                    />
                  </RadioGroup>
              </FormControl>
              <FormHelperText style={{color:"#d32f2f",fontSize: '0.75rem', fontWeight: '400'}}>{errors.gender?.message}</FormHelperText>
            </Grid>

            {/* Sport Preferences */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Sport Preference
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={options}
                sx={{ width: 300 }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label}
                value={options.find(o => o.value === watch('preference')) ?? null}
                onChange={
                  (_, value) => { 
                    const event = { 
                      target: { 
                        name: 'preference', value: value?.value || '', 
                      } 
                    }; 
                    register('preference').onChange(event); 
                    if (!errors.preference) { 
                      document.activeElement instanceof HTMLElement && document.activeElement.blur(); 
                    } 
                  }
                }
                id='preference'
                renderInput={(params) => (
                  <TextField
                  {...params}
                  label="Prefer Sport"
                  id="preference"
                  error={!!errors.preference}
                  helperText={errors.preference?.message}
                />
                )}
              />
            </Grid>
            
            {/* Address Fields */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Address Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('address')}
                margin="normal"
                fullWidth
                id="address"
                name="address"
                label="Street Address"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register('city')}
                margin="normal"
                fullWidth
                id="city"
                label="City"
                error={!!errors?.city}
                helperText={errors?.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register('state')}
                margin="normal"
                fullWidth
                id="state"
                label="State"
                error={!!errors?.state}
                helperText={errors?.state?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register('zipCode')}
                margin="normal"
                fullWidth
                id="zipCode"
                label="ZIP Code"
                error={!!errors?.zipCode}
                helperText={errors?.zipCode?.message}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 