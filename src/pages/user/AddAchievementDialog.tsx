import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface AddAchievementDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (achievement: NewAchievement) => void;
}

export interface NewAchievement {
  title: string;
  description: string;
  photoUrl: string;
  date: string;
}

export function AddAchievementDialog({ open, onClose, onAdd }: AddAchievementDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhotoUrlChange = (url: string) => {
    setPhotoUrl(url);
    setPhotoPreview(url);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    setPhotoPreview('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!photoUrl.trim()) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      photoUrl: photoUrl.trim(),
      date,
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPhotoUrl('');
    setPhotoPreview('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add Achievement</Typography>
        {/* <IconButton type="button" onClick={handleClose} size="small"> */}
          <CloseIcon />
        {/* </IconButton> */}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Alert severity="info" sx={{ mb: 1 }}>
            Share your memorable sports moments! Add achievements like tournament wins, personal records, or special milestones.
          </Alert>

          {/* Photo Upload Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Achievement Photo *
            </Typography>
            {photoPreview ? (
              <Paper
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 240,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: errors.photo ? '2px solid' : '1px solid',
                  borderColor: errors.photo ? 'error.main' : 'divider',
                }}
              >
              </Paper>
            ) : (
              <Paper
                sx={{
                  width: '100%',
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: errors.photo ? '2px dashed' : '2px dashed',
                  borderColor: errors.photo ? 'error.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Add a photo of your achievement
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Enter image URL below
                </Typography>
              </Paper>
            )}
            <TextField
              fullWidth
              label="Photo URL"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => handlePhotoUrlChange(e.target.value)}
              error={!!errors.photo}
              helperText={errors.photo || 'Paste an image URL from the web'}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Title */}
          <TextField
            fullWidth
            label="Achievement Title"
            placeholder="e.g., Won City Championship Final"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            inputProps={{ maxLength: 100 }}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            placeholder="Describe this achievement and what it means to you..."
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description || `${description.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
          />

          {/* Date */}
          <TextField
            fullWidth
            label="Date Achieved"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Achievement
        </Button>
      </DialogActions>
    </Dialog>
  );
}
