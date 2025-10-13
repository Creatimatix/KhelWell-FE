import React, { useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type Booking = {
  id: string;
  date: string; // ISO date (yyyy-mm-dd)
  startHour: number; // 0-23
  duration: number; // in hours
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  userName?: string;
};

type Turf = {
  id: string;
  name: string;
  city?: string;
  address?: string;
  hourlyRate: number;
  openHour: number; // opening hour e.g., 6
  closeHour: number; // closing hour e.g., 22
  bookings: Booking[];
};

const sampleTurfs: Turf[] = [
  {
    id: 't1',
    name: 'Green Field Turf',
    city: 'Mumbai',
    address: 'Sector 12, Andheri',
    hourlyRate: 600,
    openHour: 6,
    closeHour: 22,
    bookings: [
      { id: 'b1', date: '2025-10-10', startHour: 9, duration: 2, amount: 1200, status: 'confirmed', userName: 'Amit' },
      { id: 'b2', date: '2025-10-10', startHour: 18, duration: 1, amount: 600, status: 'pending', userName: 'Rohit' },
      { id: 'b3', date: '2025-10-09', startHour: 12, duration: 2, amount: 1200, status: 'completed', userName: 'Sana' },
    ],
  },
  {
    id: 't2',
    name: 'Stadium Turf',
    city: 'Pune',
    address: 'MG Road',
    hourlyRate: 800,
    openHour: 7,
    closeHour: 21,
    bookings: [
      { id: 'b4', date: '2025-10-10', startHour: 8, duration: 1, amount: 800, status: 'confirmed', userName: 'Vijay' },
      { id: 'b5', date: '2025-10-11', startHour: 15, duration: 2, amount: 1600, status: 'pending', userName: 'Kiran' },
    ],
  },
];

const OwnerDashboardStatic: React.FC = () => {
  const [turfs, setTurfs] = useState<Turf[]>(sampleTurfs);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newRate, setNewRate] = useState<number | ''>('');
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [detailDate, setDetailDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const totals = useMemo(() => {
    const totalBookings = turfs.reduce((acc, t) => acc + t.bookings.length, 0);
    const totalEarnings = turfs.reduce((acc, t) => acc + t.bookings.reduce((s, b) => s + b.amount, 0), 0);
    return { totalBookings, totalEarnings };
  }, [turfs]);

  const handleCreateTurf = () => {
    if (!newName || !newRate) return;
    const id = `t${Date.now()}`;
    const turf: Turf = {
      id,
      name: newName,
      city: newCity,
      address: newAddress,
      hourlyRate: Number(newRate),
      openHour: 6,
      closeHour: 22,
      bookings: [],
    };
    setTurfs((s) => [turf, ...s]);
    setCreateOpen(false);
    setNewName('');
    setNewCity('');
    setNewAddress('');
    setNewRate('');
  };

  const openDetails = (t: Turf) => {
    setSelectedTurf(t);
    setDetailDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const closeDetails = () => setSelectedTurf(null);

  const bookingsForDate = (t: Turf, date: string) => t.bookings.filter((b) => b.date === date && b.status !== 'cancelled');

  const hoursRange = (open: number, close: number) => {
    const arr: number[] = [];
    for (let h = open; h < close; h++) arr.push(h);
    return arr;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Owner Dashboard (Static)
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              <Stack spacing={1} mt={2}>
                <Typography>Total Turfs: {turfs.length}</Typography>
                <Typography>Total Bookings: {totals.totalBookings}</Typography>
                <Typography>Total Earnings: ₹{totals.totalEarnings}</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Link to="/turf/create">
                    Create New Turf
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Turfs</Typography>
              <Table size="small" sx={{ mt: 2 }} component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Hourly Rate</TableCell>
                    <TableCell>Total Bookings</TableCell>
                    <TableCell>Earnings</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turfs.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.city}</TableCell>
                      <TableCell>₹{t.hourlyRate}</TableCell>
                      <TableCell>{t.bookings.length}</TableCell>
                      <TableCell>₹{t.bookings.reduce((s, b) => s + b.amount, 0)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" onClick={() => openDetails(t)}>Details</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Turf Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Turf</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <TextField label="Turf Name" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Hourly Rate (₹)" type="number" value={newRate} onChange={(e) => setNewRate(e.target.value === '' ? '' : Number(e.target.value))} fullWidth sx={{ mb: 2 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTurf}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Turf Details Dialog */}
      <Dialog open={Boolean(selectedTurf)} onClose={closeDetails} maxWidth="md" fullWidth>
        <DialogTitle>Turf Details</DialogTitle>
        <DialogContent>
          {selectedTurf && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">{selectedTurf.name}</Typography>
                  <Typography color="text.secondary">{selectedTurf.city} • {selectedTurf.address}</Typography>
                  <Typography sx={{ mt: 1 }}>Hourly Rate: ₹{selectedTurf.hourlyRate}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <TextField
                    label="Select Date"
                    type="date"
                    value={detailDate}
                    onChange={(e) => setDetailDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="subtitle2">Bookings on {format(new Date(detailDate), 'MMM dd, yyyy')}</Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Customer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookingsForDate(selectedTurf, detailDate).map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{`${b.startHour}:00`}</TableCell>
                          <TableCell>{b.duration} hr(s)</TableCell>
                          <TableCell>₹{b.amount}</TableCell>
                          <TableCell><Chip label={b.status} size="small" /></TableCell>
                          <TableCell>{b.userName || '-'}</TableCell>
                        </TableRow>
                      ))}
                      {bookingsForDate(selectedTurf, detailDate).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>No bookings for this date.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Daily Hours ({selectedTurf.openHour}:00 - {selectedTurf.closeHour}:00)</Typography>
                  <Box mt={1}>
                    <Stack direction="column" spacing={1}>
                      {hoursRange(selectedTurf.openHour, selectedTurf.closeHour).map((h) => {
                        const occupied = bookingsForDate(selectedTurf, detailDate).some((b) => h >= b.startHour && h < b.startHour + b.duration);
                        return (
                          <Paper key={h} variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>{`${h}:00 - ${h + 1}:00`}</Box>
                            <Chip label={occupied ? 'Booked' : 'Free'} color={occupied ? 'error' : 'success'} size="small" />
                          </Paper>
                        );
                      })}
                    </Stack>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2">Quick Stats</Typography>
                  <Box mt={1}>
                    <Typography>Occupied Hours: {(() => {
                      const hours = hoursRange(selectedTurf.openHour, selectedTurf.closeHour);
                      const occ = hours.reduce((acc, h) => acc + (bookingsForDate(selectedTurf, detailDate).some((b) => h >= b.startHour && h < b.startHour + b.duration) ? 1 : 0), 0);
                      return occ;
                    })()}</Typography>
                    <Typography>Free Hours: {(() => {
                      const hours = hoursRange(selectedTurf.openHour, selectedTurf.closeHour).length;
                      const occ = hoursRange(selectedTurf.openHour, selectedTurf.closeHour).reduce((acc, h) => acc + (bookingsForDate(selectedTurf, detailDate).some((b) => h >= b.startHour && h < b.startHour + b.duration) ? 1 : 0), 0);
                      return hours - occ;
                    })()}</Typography>
                    <Typography>Total Earnings (all time): ₹{selectedTurf.bookings.reduce((s, b) => s + b.amount, 0)}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OwnerDashboardStatic;
