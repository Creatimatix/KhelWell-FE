import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  SportsSoccer as SportsIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  PhotoCamera as CameraIcon
} from '@mui/icons-material';
import { BACKEND_API_URL } from '../../utils/constant';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  short_desc?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  profile?: string;
  primary_sport_preference?: string;
  date_of_birth?: string;
  gender?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  const genderOptions = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
    { key: 'other', label: 'Other' },
    { key: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(BACKEND_API_URL+'user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }

      let data = await response.json();
      
      data = data?.data;
      console.log('User profile data:', data);
      // Validate and clean the user data
      const validatedUser = {
        ...data.user,
        short_desc: data.user.short_desc || '',
        address: data.user.address || '',
        city: data.user.city || '',
        state: data.user.state || '',
        zipcode: data.user.zipcode || '',
        profile: data.user.profile || '',
        phone: data.user.phone || '',
        date_of_birth: data.user.dob || '',
        is_verified: data.user.is_verified || false,
        is_active: data.user.is_active || true
      };
      
      setUser(validatedUser);
      setEditForm(validatedUser);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(user || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(user || {});
    setError(null);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaveLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        setSaveLoading(false);
        return;
      }

      // Use FormData for file upload
      const formData = new FormData();
      formData.append('id', String(user.id));
      formData.append('name', editForm.name ?? user.name);
      formData.append('email', editForm.email ?? user.email);
      formData.append('phone', editForm.phone ?? user.phone);
      formData.append('role', editForm.role ?? user.role);
      formData.append('short_desc', editForm.short_desc ?? user.short_desc ?? '');
      formData.append('address', editForm.address ?? user.address ?? '');
      formData.append('city', editForm.city ?? user.city ?? '');
      formData.append('state', editForm.state ?? user.state ?? '');
      formData.append('zipcode', editForm.zipcode ?? user.zipcode ?? '');
      formData.append(
        'primary_sport_preference',
        editForm.primary_sport_preference ?? user.primary_sport_preference ?? ''
      );
      formData.append('date_of_birth', editForm.date_of_birth ?? user.date_of_birth ?? '');
      formData.append('gender', editForm.gender ?? user.gender ?? '');

      // Only append file if selected
      if (profileImageFile) {
        formData.append('profile', profileImageFile);
      }

      const response = await fetch(BACKEND_API_URL+'user-update', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      const userData = data?.data || '';
      const validatedUser = {
        ...userData,
        short_desc: userData.short_desc || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipcode: userData.zipcode || '',
        profile: userData.profile || '',
        phone: userData.phone || '',
        date_of_birth: userData.dob || '',
        is_verified: userData.is_verified || false,
        is_active: userData.is_active ?? true
      };

      setUser(validatedUser);
      setEditForm(validatedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits except +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +91
    if (!cleaned.startsWith('+91')) {
      return '+91 ' + cleaned.replace('+91', '');
    }
    
    // Remove +91 and get the number part
    const numberPart = cleaned.replace('+91', '');
    
    // Format Indian phone number: +91 99999 99999
    if (numberPart.length <= 5) {
      return '+91 ' + numberPart;
    } else if (numberPart.length <= 10) {
      return '+91 ' + numberPart.slice(0, 5) + ' ' + numberPart.slice(5);
    } else {
      return '+91 ' + numberPart.slice(0, 5) + ' ' + numberPart.slice(5, 10);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof User, value: string | string[]) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="error">Failed to load user profile sss</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Box position="relative">
              <Avatar
                src={imagePreview || user.profile}
                sx={{ width: 80, height: 80, mr: 2 }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              {isEditing && (
                <Box
                  position="absolute"
                  bottom={0}
                  right={8}
                  sx={{
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profile-image-upload">
                    <CameraIcon sx={{ color: 'white', fontSize: 16, cursor: 'pointer' }} />
                  </label>
                </Box>
              )}
            </Box>
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={user.role}
                  color="primary"
                  size="small"
                />
                {user.is_verified && (
                  <Chip
                    label="Verified"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            {!isEditing && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  type="email"
                  size="small"
                />
              ) : (
                <Typography variant="body1">{user.email}</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                  placeholder="+91 99999 99999"
                  size="small"
                />
              ) : (
                <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
              </Box>
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={editForm.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={editForm.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={editForm.zipcode || ''}
                      onChange={(e) => handleInputChange('zipcode', e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1">
                  {user?.address}
                  {user?.city ? ', '+user?.city: ''}
                  {user?.state ? ', '+user?.state: ''}
                  {user?.zipcode ? ', '+user?.zipcode: ''}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <SportsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Interested Sports
                </Typography>
              </Box>
              {isEditing ? (
                <FormControl fullWidth size="small">
                  <Autocomplete
                    disablePortal
                    options={options}
                    sx={{ width: 300 }}
                    isOptionEqualToValue={(option, value) => !!value && option.value === value.value}
                    getOptionLabel={(option) => option.label}
                    value={
                      (() => {
                        const stored = typeof editForm.primary_sport_preference === 'string'
                          ? editForm.primary_sport_preference
                          : Array.isArray(editForm.primary_sport_preference)
                            ? editForm.primary_sport_preference[0]
                            : '';
                        return stored ? (options.find(o => o.value === stored) ?? null) : null;
                      })()
                    }
                    onChange={(_, value) => {
                      handleInputChange(
                        'primary_sport_preference',
                        value ? value.value : ''
                      );
                    }}
                    id="preference"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Prefer Sport"
                        id="preference"
                      />
                    )}
                  />
                </FormControl>
              ) : (
                <Box display="flex" flexWrap="wrap" gap={1}>
                    <Chip label={user.primary_sport_preference} size="small" />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Bio
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={editForm.short_desc || ''}
                  onChange={(e) => handleInputChange('short_desc', e.target.value)}
                  placeholder="Tell us about yourself..."
                  size="small"
                />
              ) : (
                <Typography variant="body1">
                  {user.short_desc || 'No bio provided'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  type="date"
                  value={editForm.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <Typography variant="body1">
                  {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <GenderIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
              </Box>
              {isEditing ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={editForm.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    {genderOptions.map((gender) => (
                      <MenuItem
                        key={gender.key}
                        value={gender.key}
                        selected={editForm.gender === gender.key}
                      >
                        {gender.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="body1">
                  {user.gender || 'Not specified'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="body1">
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Status
              </Typography>
              <Chip
                label={user.is_active ? 'Active' : 'Inactive'}
                color={user.is_active ? 'success' : 'error'}
                size="small"
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saveLoading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile; 