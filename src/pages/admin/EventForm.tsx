import React, { useEffect, useMemo, useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Typography
} from '@mui/material';

export interface EventPayload {
  title: string;
  userName?: string;
  registrationStartDate: string; // yyyy-mm-dd
  registrationEndDate: string;   // yyyy-mm-dd
  eventStartDate: string;        // yyyy-mm-dd
  eventEndDate: string;          // yyyy-mm-dd
  registrationAmount: number;
  teamLimit: number | '';
  sportsType: string;
  eventType: 'individual' | 'team';
  locationLat: string;
  locationLon: string;
  bannerFile?: File | string | null;
  description: string;
  rules: string;
  isActive: boolean;
  address: string;
}

interface Props {
  value: EventPayload;
  onChange: (value: EventPayload) => void;
  disabled?: boolean;
  onValidityChange?: (valid: boolean) => void;
  showErrors?: boolean;
  serverErrors?: Record<string, string>;
}

const sportsOptions = [
  'football',
  'cricket',
  'tennis',
  'basketball',
  'badminton',
  'volleyball',
  'multi-sport',
  'general'
];

const RichTextEditor: React.FC<{
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  label: string;
}> = ({ value, onChange, disabled, label }) => {
  const [loaded, setLoaded] = useState(false);
  const [modules, setModules] = useState<{ CKEditor: any; ClassicEditor: any } | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic')
    ])
      .then(([reactMod, classicMod]) => {
        if (!mounted) return;
        const CKEditor = (reactMod as any).CKEditor || (reactMod as any).default?.CKEditor;
        const ClassicEditor = (classicMod as any).default || classicMod;
        setModules({ CKEditor, ClassicEditor });
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!loaded || !modules?.CKEditor || !modules?.ClassicEditor) {
    return (
      <TextField
        fullWidth
        label={label}
        multiline
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        
      />
    );
  }

  const { CKEditor, ClassicEditor } = modules;
  return (
    <Box sx={{ '& .ck-editor__editable_inline': { minHeight: 200 } }}>
      <Typography variant="subtitle2" gutterBottom>{label}</Typography>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        
        onChange={(event: any, editor: any) => onChange(editor.getData())}
      />
    </Box>
  );
};

const EventForm: React.FC<Props> = ({ value, onChange, disabled, onValidityChange, showErrors, serverErrors = {} }) => {
  
  const handleField = <K extends keyof EventPayload>(key: K, v: EventPayload[K]) => {
    onChange({ ...value, [key]: v });
  };

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    // Client-side validation errors
    if (!value.title.trim()) errs.title = 'Event title is required';
    if (value.registrationAmount === null || value.registrationAmount === undefined || isNaN(value.registrationAmount as any)) {
      errs.registrationAmount = 'Registration fee is required';
    } else if (value.registrationAmount < 0) {
      errs.registrationAmount = 'Registration fee cannot be negative';
    }
    if (!value.registrationStartDate) errs.registrationStartDate = 'Registration start date is required';
    if (!value.registrationEndDate) errs.registrationEndDate = 'Registration end date is required';
    if (value.registrationStartDate && value.registrationEndDate && value.registrationStartDate > value.registrationEndDate) {
      errs.registrationEndDate = 'End date cannot be before start date';
    }
    if (!value.eventStartDate) errs.eventStartDate = 'Event start date & time is required';
    if (!value.eventEndDate) errs.eventEndDate = 'Event end date & time is required';
    if (value.eventStartDate && value.eventEndDate && value.eventStartDate > value.eventEndDate) {
      errs.eventEndDate = 'End date/time cannot be before start date/time';
    }
    if (!value.sportsType) errs.sportsType = 'Sports type is required';
    if (!value.address.trim()) errs.address = 'Event address is required';
    
    // Server-side validation errors (override client-side errors if present)
    Object.keys(serverErrors).forEach(key => {
      if (serverErrors[key]) {
        errs[key] = serverErrors[key];
      }
    });
    
    return errs;
  }, [value, serverErrors]);

  const isValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (onValidityChange) onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Event Title"
          value={value.title}
          onChange={(e) => handleField('title', e.target.value)}
          required
          
          error={!!errors.title && (!!showErrors || !!serverErrors.title)}
          helperText={(showErrors || !!serverErrors.title) ? errors.title : ''}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="User Name (optional)"
          value={value.userName || ''}
          onChange={(e) => handleField('userName', e.target.value)}
          
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Registration Amount (₹)"
          type="number"
          value={value.registrationAmount}
          onChange={(e) => handleField('registrationAmount', parseFloat(e.target.value) || 0)}
          
          error={!!errors.registrationAmount && (!!showErrors || !!serverErrors.registrationAmount)}
          helperText={(showErrors || !!serverErrors.registrationAmount) ? errors.registrationAmount : ''}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Registration Start Date"
          type="date"
          value={value.registrationStartDate}
          onChange={(e) => handleField('registrationStartDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          
          error={!!errors.registrationStartDate && (!!showErrors || !!serverErrors.registrationStartDate)}
          helperText={(showErrors || !!serverErrors.registrationStartDate) ? errors.registrationStartDate : ''}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Registration End Date"
          type="date"
          value={value.registrationEndDate}
          onChange={(e) => handleField('registrationEndDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          
          error={!!errors.registrationEndDate && (!!showErrors || !!serverErrors.registrationEndDate)}
          helperText={(showErrors || !!serverErrors.registrationEndDate) ? errors.registrationEndDate : ''}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Event Start Date & Time"
          type="datetime-local"
          value={value.eventStartDate}
          onChange={(e) => handleField('eventStartDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.eventStartDate && (!!showErrors || !!serverErrors.eventStartDate)}
          helperText={(showErrors || !!serverErrors.eventStartDate) ? errors.eventStartDate : ''}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Event End Date & Time"
          type="datetime-local"
          value={value.eventEndDate}
          onChange={(e) => handleField('eventEndDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!errors.eventEndDate && (!!showErrors || !!serverErrors.eventEndDate)}
          helperText={(showErrors || !!serverErrors.eventEndDate) ? errors.eventEndDate : ''}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Team Limit"
          type="number"
          value={value.teamLimit}
          onChange={(e) => handleField('teamLimit', e.target.value === '' ? '' : parseInt(e.target.value))}
          
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Sports Type</InputLabel>
          <Select
            value={value.sportsType}
            onChange={(e) => handleField('sportsType', e.target.value as string)}
            label="Sports Type"
            
          >
            {sportsOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
          {errors.sportsType && (showErrors || !!serverErrors.sportsType) && (
            <Typography variant="caption" color="error">{errors.sportsType}</Typography>
          )}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={value.eventType}
            onChange={(e) => handleField('eventType', e.target.value as 'individual' | 'team')}
            label="Event Type"
            
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="team">Team</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Latitude"
          value={value.locationLat}
          onChange={(e) => handleField('locationLat', e.target.value)}
          error={!!errors.locationLat && (!!showErrors || !!serverErrors.locationLat)}
          helperText={(showErrors || !!serverErrors.locationLat) ? errors.locationLat : ''}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Longitude"
          value={value.locationLon}
          onChange={(e) => handleField('locationLon', e.target.value)}
          error={!!errors.locationLon && (!!showErrors || !!serverErrors.locationLon)}
          helperText={(showErrors || !!serverErrors.locationLon) ? errors.locationLon : ''}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address for Event"
          value={value.address}
          onChange={(e) => handleField('address', e.target.value)}
          
          error={!!errors.address && (!!showErrors || !!serverErrors.address)}
          helperText={(showErrors || !!serverErrors.address) ? errors.address : ''}
        />
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" component="label" >
            Choose Banner Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => handleField('bannerFile', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            />
          </Button>
          <Typography variant="body2" color="text.secondary">
            Recommended: 1200x400px (JPEG/PNG)
          </Typography>
          
        </Box>
        {serverErrors.bannerFile && <div style={{ color: 'red', marginTop: 8 }}>{(showErrors || !!serverErrors.bannerFile) ? errors.bannerFile : ''}</div>}
        {value.bannerFile && (
          <Box mt={2}>
            <img
              src={typeof value.bannerFile === 'string' ? value.bannerFile : URL.createObjectURL(value.bannerFile)}
              alt="Banner preview"
              style={{ maxWidth: '100%', height: '100px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            {typeof value.bannerFile === 'object' && value.bannerFile && (
              <Typography variant="caption" display="block" mt={1}>
                {value.bannerFile.name}
              </Typography>
            )}
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <RichTextEditor
          label="Description"
          value={value.description}
          onChange={(val) => handleField('description', val)}
          disabled={false}
        />
      </Grid>

      <Grid item xs={12}>
        <RichTextEditor
          label="Rules and Regulations"
          value={value.rules}
          onChange={(val) => handleField('rules', val)}
          disabled={false}
          
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch checked={value.isActive} onChange={(e) => handleField('isActive', e.target.checked)} />}
          label="Active"
        />
      </Grid>
    </Grid>
  );
};

export default EventForm;


