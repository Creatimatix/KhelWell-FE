import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import EventForm, { EventPayload } from './EventForm';
import toast from 'react-hot-toast';
import { BACKEND_API_URL } from '../../utils/constant';

const AdminEventCreate: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<EventPayload>({
    title: '',
    userName: '',
    registrationStartDate: '',
    registrationEndDate: '',
    eventStartDate: '',
    eventEndDate: '',
    registrationAmount: 0,
    teamLimit: '',
    sportsType: 'general',
    eventType: 'individual',
    locationLat: '',
    locationLon: '',
    bannerFile: null,
    description: '',
    rules: '',
    isActive: true,
    address: ''
  });

  const handleSubmit = async () => {
    try {
      setShowErrors(true);
      setServerErrors({}); // Clear previous server errors
      if (!isValid) return;
      setSaving(true);
      const token = localStorage.getItem('auth_token');

      // Use FormData to support optional file upload
      const body = new FormData();
      body.append('title', formData.title);
      if (formData.userName) body.append('userName', formData.userName);
      body.append('registrationStartDate', formData.registrationStartDate);
      body.append('registrationEndDate', formData.registrationEndDate);
      body.append('eventStartDate', formData.eventStartDate);
      body.append('eventEndDate', formData.eventEndDate);
      body.append('registrationAmount', String(formData.registrationAmount));
      if (formData.teamLimit !== '') body.append('teamLimit', String(formData.teamLimit));
      body.append('sportsType', formData.sportsType);
      body.append('eventType', formData.eventType);
      body.append('locationLat', formData.locationLat);
      body.append('locationLon', formData.locationLon);
      if (formData.bannerFile && typeof formData.bannerFile === 'object') {
        body.append('bannerFile', formData.bannerFile);
      }
      body.append('description', formData.description);
      body.append('rules', formData.rules);
      body.append('isActive', String(formData.isActive));
      body.append('address', formData.address);

      const response = await fetch(BACKEND_API_URL+'events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body
      });
      const data = await response.json();
      if (!response.ok) {
        // Handle server validation errors
        if (data.errors && typeof data.errors === 'object') {
          setServerErrors(data.errors);
          return; // Don't throw error, let user see field-specific errors
        }
        throw new Error(data.message || 'Failed to create event');
      }

      console.log("Data: ", data);

      toast.success('Event created successfully!');
      // window.location.href = '/admin/events';
    } catch (err: any) {
      console.log("ERROR:", err);
      toast.error(err.message);
    } finally {
      console.log("Finally:");
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Create Event</Typography>
      <Paper sx={{ p: 2 }}>
        <EventForm value={formData} onChange={setFormData} disabled={saving} onValidityChange={setIsValid} showErrors={showErrors} serverErrors={serverErrors} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={() => (window.location.href = '/admin/events')} sx={{ mr: 1 }} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
          {/* disabled={saving || !isValid} */}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminEventCreate;


