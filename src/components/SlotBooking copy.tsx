import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Close as CloseIcon } from '@mui/icons-material';

interface TimeRange {
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  value: number;
}

interface Turf {
  id: string;
  name: string;
  price: number;
  description: string;
  sportType: string;
}

interface SlotBookingProps {
  onBookingComplete?: (booking: any) => void;
  onClose?: () => void;
}

const SlotBooking: React.FC<SlotBookingProps> = ({ onBookingComplete, onClose }) => {
  // Static turf data - multiple turfs for selection
  const availableTurfs: Turf[] = [
    {
      id: "turf1",
      name: "Premium Football Ground",
      price: 1200,
      description: "Full-size football field with professional quality turf",
      sportType: "football"
    },
    {
      id: "turf2", 
      name: "Cricket Pitch",
      price: 1000,
      description: "Cricket pitch with proper dimensions and facilities",
      sportType: "cricket"
    },
    {
      id: "turf3",
      name: "Tennis Court",
      price: 800,
      description: "Professional tennis court with lighting",
      sportType: "tennis"
    },
    {
      id: "turf4",
      name: "Basketball Court",
      price: 600,
      description: "Indoor basketball court with air conditioning",
      sportType: "basketball"
    },
    {
      id: "turf5",
      name: "Badminton Court",
      price: 500,
      description: "Professional badminton court with proper flooring",
      sportType: "badminton"
    },
    {
      id: "turf6",
      name: "Volleyball Court",
      price: 700,
      description: "Beach volleyball court with sand surface",
      sportType: "volleyball"
    },
    {
      id: "turf7",
      name: "Multi-Sport Ground",
      price: 900,
      description: "Versatile ground for multiple sports",
      sportType: "multi-sport"
    },
    {
      id: "turf8",
      name: "Training Ground",
      price: 400,
      description: "Basic training ground for practice sessions",
      sportType: "general"
    }
  ];

  const [selectedDate, setSelectedDate] = useState<Date | null>(addDays(new Date(), 1));
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [lastSelectedSlot, setLastSelectedSlot] = useState<number | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Select Turf & Date', 'Select Time Range', 'Booking Details', 'Confirmation'];

  // Generate time slots (30-minute intervals for 24 hours) - matching the provided logic
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      // First slot: hour:00 - hour:30
      const startTime1 = `${hour.toString().padStart(2, '0')}:00`;
      const endTime1 = `${hour.toString().padStart(2, '0')}:30`;
      
      // Second slot: hour:30 - (hour+1):00
      const nextHour = (hour + 1) % 24;
      const startTime2 = `${hour.toString().padStart(2, '0')}:30`;
      const endTime2 = `${nextHour.toString().padStart(2, '0')}:00`;
      
      // Simulate some booked slots (for demo purposes)
      const isBooked1 = Math.random() < 0.15; // 15% chance of being booked
      const isBooked2 = Math.random() < 0.15; // 15% chance of being booked
      
      slots.push({
        startTime: startTime1,
        endTime: endTime1,
        isAvailable: !isBooked1,
        isBooked: isBooked1,
        value: hour * 2 // Matching the provided logic
      });
      
      slots.push({
        startTime: startTime2,
        endTime: endTime2,
        isAvailable: !isBooked2,
        isBooked: isBooked2,
        value: hour * 2 + 1 // Matching the provided logic
      });
    }
    
    return slots;
  };

  // Load time slots when turf and date are selected
  useEffect(() => {
    if (selectedTurf && selectedDate) {
      const slots = generateTimeSlots();
      setTimeSlots(slots);
      setSelectedSlots([]);
      setLastSelectedSlot(null);
      setTimeRanges([]);
    }
  }, [selectedTurf, selectedDate]);

  // Reset selection when turf changes
  useEffect(() => {
    setTimeRanges([]);
    setSelectedSlots([]);
    setLastSelectedSlot(null);
    setActiveStep(0);
  }, [selectedTurf]);

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (!selectedTurf) return;
    
    if (slot.isBooked) {
      setError('This time slot is already booked');
      return;
    }
    
    // If no slots selected, start with this slot
    if (selectedSlots.length === 0) {
      setSelectedSlots([slot.value]);
      setLastSelectedSlot(slot.value);
      setError(null);
      return;
    }
    
    const firstSelectedSlot = selectedSlots[0];
    const lastSelectedSlotValue = selectedSlots[selectedSlots.length - 1];
    
    // If clicking on the same slot as last selected, deselect it
    if (slot.value === lastSelectedSlotValue && selectedSlots.length === 1) {
      setSelectedSlots([]);
      setLastSelectedSlot(null);
      setTimeRanges([]);
      setError(null);
      return;
    }
    
    // If clicking on the next consecutive slot, add it to selection
    if (slot.value === lastSelectedSlotValue + 1) {
      const newSelectedSlots = [...selectedSlots, slot.value];
      setSelectedSlots(newSelectedSlots);
      setLastSelectedSlot(slot.value);
      
      // Create time range from first to last selected slot
      const firstSlot = timeSlots.find(s => s.value === firstSelectedSlot);
      const lastSlot = timeSlots.find(s => s.value === slot.value);
      
      if (firstSlot && lastSlot) {
        const duration = (selectedSlots.length + 1) * 0.5; // Each slot is 30 minutes
        const totalPrice = selectedTurf.price * duration;
        
        const newRange: TimeRange = {
          startTime: firstSlot.startTime,
          endTime: lastSlot.endTime,
          duration,
          totalPrice
        };
        
        setTimeRanges([newRange]);
      }
      
      setError(null);
    } else {
      // If not consecutive, start new selection with this slot
      setSelectedSlots([slot.value]);
      setLastSelectedSlot(slot.value);
      setTimeRanges([]);
      setError(null);
    }
  };


  const handleBooking = async () => {
    if (timeRanges.length === 0 || !selectedDate || !selectedTurf) return;

    setBookingLoading(true);
    setError(null);

    try {
      // Simulate booking process with static data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const bookingData = {
        id: `booking-${Date.now()}`,
        turfId: selectedTurf.id,
        turfName: selectedTurf.name,
        sportType: selectedTurf.sportType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: timeRanges[0].startTime,
        endTime: timeRanges[0].endTime,
        duration: timeRanges[0].duration,
        totalPrice: timeRanges[0].totalPrice,
        specialRequests: specialRequests.trim() || '',
        status: 'confirmed'
      };

      setActiveStep(3);

      console.log("bookingData", bookingData);

      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const resetSelection = () => {
    setTimeRanges([]);
    setSelectedSlots([]);
    setLastSelectedSlot(null);
    setActiveStep(1);
  };



  const formatPrice = (price: number) => {
    return `₹${price}`;
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Turf & Date
            </Typography>
            
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Choose a turf:
              </Typography>
              <Grid container spacing={2}>
                {availableTurfs.map((turf) => (
                  <Grid item xs={6} sm={3} key={turf.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedTurf?.id === turf.id ? 2 : 1,
                        borderColor: selectedTurf?.id === turf.id ? 'primary.main' : 'divider',
                        '&:hover': { boxShadow: 2 },
                        transition: 'all 0.2s ease-in-out',
                        height: '100%'
                      }}
                      onClick={() => setSelectedTurf(turf)}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
                          {turf.name}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {formatPrice(turf.price)}/hour
                        </Typography>
                        <Chip 
                          label={turf.sportType} 
                          size="small" 
                          color="secondary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  resetSelection();
                }}
                shouldDisableDate={isDateDisabled}
                minDate={addDays(new Date(), 1)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Time Range
            </Typography>
            
            {selectedDate && selectedTurf && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Select time range for {format(selectedDate, 'MMM dd, yyyy')} - {selectedTurf.name}
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} action={
                    <Button color="inherit" size="small" onClick={() => setError(null)}>
                      Dismiss
                    </Button>
                  }>
                    {error}
                  </Alert>
                )}

                {selectedSlots.length > 0 && (
                  <Card sx={{ border: 2, borderColor: 'primary.main', mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click on consecutive slots to extend your selection, or click the same slot to deselect
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {timeSlots.length > 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Available time slots (30-minute intervals) - Click to select consecutive slots
                    </Typography>
                    <Grid container spacing={0.5}>
                      {timeSlots.map((slot, index) => {
                        const isSelected = selectedSlots.includes(slot.value);
                        const isBooked = slot.isBooked;
                        
                        return (
                          <Grid item xs={3} sm={2.4} md={2} lg={1.5} key={index}>
                            <Card 
                              sx={{
                                cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                                '&:hover': slot.isAvailable ? { boxShadow: 2 } : {},
                                border: 1,
                                borderColor: isBooked
                                  ? 'error.main'
                                  : isSelected
                                  ? 'success.main'
                                  : 'divider',
                                backgroundColor: isBooked
                                  ? '#fdecea'        // light red for booked
                                  : isSelected
                                  ? '#'        // solid green for selected
                                  : 'background.paper',
                                color: isBooked
                                  ? '#b71c1c'        // dark red text
                                  : isSelected
                                  ? '#fff'            // white text when selected
                                  : 'text.primary',   // default text color
                                opacity: slot.isAvailable ? 1 : 0.6,
                                transition: 'all 0.2s ease-in-out',
                                minHeight: 50,
                                maxHeight: 60,
                                borderRadius: 1,
                              }}                              
                              onClick={() => handleTimeSlotClick(slot)}
                            >
                              <CardContent sx={{ textAlign: 'center', py: 0.5, px: 0.5 }}>
                                <Typography variant="caption" sx={{ 
                                  fontSize: '0.6rem', 
                                  lineHeight: 1.2, 
                                  display: 'block',
                                  color: isBooked ? 'error.main' : isSelected ? 'primary.main' : 'text.primary'
                                }}>
                                  {format(new Date(`2000-01-01T${slot.startTime}`), 'h:mm a')}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  fontSize: '0.5rem', 
                                  lineHeight: 1, 
                                  display: 'block',
                                  color: isBooked ? 'error.main' : isSelected ? 'primary.main' : 'text.secondary'
                                }}>
                                  to
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  fontSize: '0.6rem', 
                                  lineHeight: 1.2, 
                                  display: 'block',
                                  color: isBooked ? 'error.main' : isSelected ? 'primary.main' : 'text.primary'
                                }}>
                                  {format(new Date(`2000-01-01T${slot.endTime}`), 'h:mm a')}
                                </Typography>
                                <Box sx={{ mt: 0.2 }}>
                                  <Chip 
                                    label={isBooked ? '✗' : isSelected ? '✓' : '○'} 
                                    color={isBooked ? 'error' : isSelected ? 'primary' : 'default'}
                                    variant={isSelected ? 'filled' : 'outlined'}
                                    size="small" 
                                    sx={{ minWidth: 16, height: 12, fontSize: '0.5rem' }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ) : (
                  <Alert severity="info">
                    No available time slots for this date.
                  </Alert>
                )}


                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>How to book:</strong> Click on consecutive time slots to select your range. For example, click "6:00 PM - 6:30 PM", then "6:30 PM - 7:00 PM", then "7:00 PM - 7:30 PM" to book 1.5 hours. Click the same slot again to deselect it.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            
            {timeRanges.length > 0 && selectedTurf && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Booking Summary
                </Typography>
                <Card sx={{ border: 2, borderColor: 'primary.main' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {selectedTurf.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time: {format(new Date(`2000-01-01T${timeRanges[0].startTime}`), 'h:mm a')} - {format(new Date(`2000-01-01T${timeRanges[0].endTime}`), 'h:mm a')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {timeRanges[0].duration} hours
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                      Total: {formatPrice(timeRanges[0].totalPrice)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Requests (Optional)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests..."
              sx={{ mb: 2 }}
            />

            <Alert severity="info">
              <Typography variant="body2">
                Please review your booking details above. You can modify your selection by going back to the previous step.
              </Typography>
            </Alert>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Confirmation
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6">Booking Successful!</Typography>
              <Typography variant="body2">
                Your booking has been confirmed. You will receive a confirmation email shortly.
              </Typography>
            </Alert>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>
                <Box>
                  <Typography variant="body2">
                    • Date: {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2">
                    • Time: {timeRanges[0] && `${format(new Date(`2000-01-01T${timeRanges[0].startTime}`), 'h:mm a')} - ${format(new Date(`2000-01-01T${timeRanges[0].endTime}`), 'h:mm a')}`}
                  </Typography>
                  <Typography variant="body2">
                    • Turf: {selectedTurf?.name}
                  </Typography>
                  <Typography variant="body2">
                    • Duration: {timeRanges[0]?.duration || 0} hours
                  </Typography>
                  <Typography variant="body2">
                    • Total Amount: {formatPrice(timeRanges[0]?.totalPrice || 0)}
                  </Typography>
                  {specialRequests && (
                    <Typography variant="body2">
                      • Special Requests: {specialRequests}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            Book Turf Slot
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {timeRanges.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="success.dark" sx={{ fontWeight: 'bold' }}>
                ✅ Time Range Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {timeRanges[0] && (
                  <>
                    {format(new Date(`2000-01-01T${timeRanges[0].startTime}`), 'h:mm a')} - {format(new Date(`2000-01-01T${timeRanges[0].endTime}`), 'h:mm a')}
                  </>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {timeRanges[0]?.duration || 0} hours
              </Typography>
              <Typography variant="h6" color="success.dark" sx={{ fontWeight: 'bold' }}>
                Total: {formatPrice(timeRanges[0]?.totalPrice || 0)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep > 0 && activeStep < 3 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          
          {activeStep === 0 && selectedDate && selectedTurf && (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(1)}
              disabled={!selectedDate || !selectedTurf}
            >
              Continue
            </Button>
          )}
          
          {activeStep === 1 && timeRanges.length > 0 && (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(2)}
              disabled={timeRanges.length === 0}
            >
              Continue
            </Button>
          )}
          
          {activeStep === 2 && (
            <Button 
              variant="contained" 
              onClick={handleBooking}
              disabled={bookingLoading || timeRanges.length === 0}
            >
              {bookingLoading ? <CircularProgress size={20} /> : 'Confirm Booking'}
            </Button>
          )}
          
          {activeStep === 3 && (
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SlotBooking; 