import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import EventForm, { EventPayload } from './EventForm';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { BACKEND_API_URL } from '../../utils/constant';

const AdminEventEdit: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<EventPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(BACKEND_API_URL+`events/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to load event');
        const data = await res.json();
        const e = data.data || data; 
        console.log("E:", e);
        setFormData({
          title: e.title || '',
          userName: e.user_name || '',
          registrationStartDate: (e.registration_start_date || '').split('T')[0] || '',
          registrationEndDate: (e.registration_end_date || '').split('T')[0] || '',
          eventStartDate: (e.event_start_date || '') || '',
          eventEndDate: (e.event_end_date || '') || '',
          registrationAmount: e.registration_amount || 0,
          teamLimit: typeof e.team_limit === 'number' ? e.team_limit : '',
          sportsType: (e.sports_type).toLowerCase() || 'general',
          eventType: ((e.event_type).toLowerCase() as 'individual' | 'team') || 'individual',
          locationLat: e.location_lat || '',
          locationLon: e.location_lon || '',
          bannerFile: e.banner ? (e.banner.startsWith('http') ? e.banner : `${e.banner_url}`) : null,
          description: e.description || '',
          rules: e.rules || '',
          isActive: typeof e.is_active === 'boolean' ? e.is_active : true,
          address: e.address || ''
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (!formData) return;
      setShowErrors(true);
      setServerErrors({}); // Clear previous server errors
      if (!isValid) return;
      setSaving(true);
      const token = localStorage.getItem('auth_token');
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
      // Add method override for servers that don't support PATCH/PUT
      // body.append('_method', 'PUT');

      let response = await fetch(BACKEND_API_URL+`events/${id}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json' 
        },
        body
      });

      // If PATCH method is not supported, try POST with method override
      if (!response.ok && response.status === 405) {
        console.log('PATCH method not supported, trying POST with method override');
        response = await fetch(BACKEND_API_URL+`events/${id}`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json' 
          },
          body
        });
      }

      if (!response.ok) {
        const data = await response.json();
        // Handle server validation errors
        if (data.errors && typeof data.errors === 'object') {
          setServerErrors(data.errors);
          return; // Don't throw error, let user see field-specific errors
        }
        throw new Error(data.message || 'Failed to update event');
      }

      toast.success('Event updated successfully!');
      window.location.href = '/admin/events';
    } catch (err: any) {
      console.log("Error: ", err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <Box p={3}><Typography>Loading...</Typography></Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Edit Event</Typography>
      <Paper sx={{ p: 2 }}>
        <EventForm value={formData} onChange={setFormData} disabled={saving} onValidityChange={setIsValid} showErrors={showErrors} serverErrors={serverErrors} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={() => (window.location.href = '/admin/events')} sx={{ mr: 1 }} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminEventEdit;


