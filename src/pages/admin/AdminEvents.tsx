import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { BACKEND_API_URL } from '../../utils/constant';
// event form types handled in dedicated pages

interface EventItem {
  id: string;
  title: string;
  sports_type?: string;
  event_type?: 'individual' | 'team' | string;
  registration_end_date?: string;
  registration_start_date?: string;
  event_start_date?: string;
  event_end_date?: string;
  address?: string;
  banner_url?: string;
  banner?: string;
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // dialog removed in favor of dedicated pages
  // const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(BACKEND_API_URL+'events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events.data || []);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    // navigate to create page
    window.location.href = '/admin/events/create';
  };

  const handleEditEvent = (event: EventItem) => {
    window.location.href = `/admin/events/${event.id}/edit`;
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Event deleted successfully!');
        fetchEvents();
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // no status color for simplified table

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Events</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Reg. Dates</TableCell>
              <TableCell>Event Dates</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  { event.banner && <img src={event.banner_url} style={{width: '100px', height: '60px', objectFit: 'cover'}} alt={event.title} /> }
                {event.title}</TableCell>
                <TableCell>{event.event_type}</TableCell>
                <TableCell>{event.sports_type}</TableCell>
                <TableCell>
                  {(event.registration_start_date && formatDate(event.registration_start_date)) || '-'}
                  {' - '}
                  {(event.registration_end_date && formatDate(event.registration_end_date)) || '-'}
                </TableCell>
                <TableCell>
                  {(event.event_start_date && formatDate(event.event_start_date)) || '-'}
                  {' - '}
                  {(event.event_end_date && formatDate(event.event_end_date)) || '-'}
                </TableCell>
                <TableCell>{event.address || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditEvent(event)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEvent(event.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog removed; create/edit now happen on dedicated pages */}
    </Box>
  );
};

export default AdminEvents; 