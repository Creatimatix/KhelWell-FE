import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SaveIcon from "@mui/icons-material/Save";
import { BACKEND_API_URL } from "../../utils/constant";
import axios from "axios";

type SportRow = {
  id: number;
  sportName: string;
  dimension?: string;
  capacity?: number | "";
  ratePerHour?: number | "";
  status: "Available" | "Unavailable";
};

type ImageItem = {
  id: string;
  file?: File | null;
  url: string; // local preview or uploaded url
  alt?: string;
  isDefault?: boolean;
  sortOrder?: number;
};

const STEPS = ["Home", "Images / Links", "Sports & Pricing"];

/**
 * TurfWizard - single-file multi-step component to create a turf
 */
export default function TurfWizard() {
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 - basic details
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [pricing, setPricing] = useState<string>('800');
  const [isActive, setIsActive] = useState(true);
  const [timing, setTiming] = useState("");

  // Step 2 - images
  const [images, setImages] = useState<ImageItem[]>([]);
  // helper unique id
  const newImageId = () => Math.random().toString(36).slice(2, 9);

  // Step 3 - sports rows
  const [sports, setSports] = useState<SportRow[]>([
    // can prefill sample rows if desired
  ]);
  const [sportForm, setSportForm] = useState<Omit<SportRow, "id">>({
    sportName: "",
    dimension: "",
    capacity: "",
    ratePerHour: "",
    status: "Available",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived - can proceed to next?
  const canGoToImages = useMemo(() => name.trim().length > 1 && slug.trim().length > 0, [name, slug]);
  const canGoToSports = useMemo(() => images.length > 0, [images]);

  // ********** Step navigation **********
  function handleNext() {
    // validate current step
    if (activeStep === 0) {
      const e: Record<string, string> = {};
      if (!name.trim()) e.name = "Name is required";
      if (!slug.trim()) e.slug  = "URL slug is required";
      if (!pricing) e.pricing  = "Pricing is required";
      if (!address.trim()) e.address  = "Location is required";
      setErrors(e);
      if (Object.keys(e).length) return;
    }

    if (activeStep === 1) {
      if (images.length === 0) {
        setErrors({ images: "At least one image is required" });
        return;
      }
      setErrors({});
    }

    setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function handleBack() {
    setActiveStep((s) => Math.max(s - 1, 0));
  }

  // ********** Image handling **********
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).map((f) => {
      const url = URL.createObjectURL(f);
      return {
        id: newImageId(),
        file: f,
        url,
        alt: f.name,
        isDefault: images.length === 0, // first uploaded set default
        sortOrder: images.length,
      } as ImageItem;
    });
    setImages((prev) => [...prev, ...arr]);
    setErrors((e) => ({ ...e, images: "" }));
  };

  const setDefaultImage = (id: string) => {
    setImages((prev) => prev.map((it) => ({ ...it, isDefault: it.id === id })));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      // if default removed, ensure first (if any) becomes default
      if (!filtered.some((f) => f.isDefault) && filtered.length) filtered[0].isDefault = true;
      return filtered;
    });
  };

  const updateImageAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((p) => (p.id === id ? { ...p, alt } : p)));
  };

  // simple reorder: move up/down
  const moveImage = (index: number, dir: -1 | 1) => {
    setImages((prev) => {
      const clone = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= clone.length) return prev;
      const tmp = clone[newIndex];
      clone[newIndex] = clone[index];
      clone[index] = tmp;
      return clone.map((it, idx) => ({ ...it, sortOrder: idx }));
    });
  };

  // ********** Sports handling **********
  function addSportRow() {
    if (!sportForm.sportName) {
      alert("Please select a sport");
      return;
    }
    const newRow: SportRow = {
      id: Date.now(),
      ...sportForm,
      capacity: sportForm.capacity === "" ? "" : Number(sportForm.capacity),
      ratePerHour: sportForm.ratePerHour === "" ? "" : Number(sportForm.ratePerHour),
    };
    setSports((s) => [...s, newRow]);
    // reset form
    setSportForm({
      sportName: "",
      dimension: "",
      capacity: "",
      ratePerHour: "",
      status: "Available",
    });
  }

  function removeSportRow(id: number) {
    setSports((s) => s.filter((r) => r.id !== id));
  }

  // ********** Final submit **********
  async function handleSubmitAll() {
    // final validation can go here
    const payload = {
      name,
      slug,
      short_description: shortDesc,
      description,
      location: address || null,
      address: address || null,
      latitude: latitude || null,
      longitude: longitude || null,
      timing,
      pricing,
      is_active: isActive,
      images: images.map((i) => ({ url: i.url, alt: i.alt, isDefault: !!i.isDefault, sortOrder: i.sortOrder })),
      sports: sports.map((s) => ({
        sportName: s.sportName,
        dimension: s.dimension,
        capacity: s.capacity,
        ratePerHour: s.ratePerHour,
        status: s.status,
      })),
    };

    console.log("FINAL PAYLOAD", payload);

    // Example: send to API - replace with your axios call
    try {
      const response = await axios.post(BACKEND_API_URL+'turf/store', payload, { withCredentials: true });
      console.log('Turf',response);
    } catch (err) {
      console.error(err);
      alert('Failed to create');
    }
    // alert("Payload logged to console (replace with API call).");
  }

  // ********** Small UI helpers **********
  const sportOptions = [
    "Football",
    "Cricket",
    "Tennis",
    "Basketball",
    "Badminton",
    "Volleyball",
    "Karate",
    "Multi-sport",
  ];

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // remove invalid chars
      .replace(/\s+/g, '-')          // replace spaces with -
      .replace(/-+/g, '-');          // collapse multiple -
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(generateSlug(value)); // auto update slug
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Turf — Multi-step
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={handleNameChange}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Turf URL (slug)"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  fullWidth
                  placeholder="e.g., rutherford-and-sons"
                  error={!!errors.slug}
                  helperText={errors.slug}
                />
              </Grid> 

              <Grid item xs={12} md={6}>
                <TextField label="Timing" value={timing} onChange={(e) => setTiming(e.target.value)} fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  label="Location" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  fullWidth 
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Short Description"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} fullWidth />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField 
                  label="Pricing" 
                  value={pricing} 
                  onChange={(e) => setPricing(e.target.value)} 
                  error={!!errors.pricing}
                  helperText={errors.pricing}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                  label="Is Available?"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Images
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Button component="label" startIcon={<AddPhotoAlternateIcon />}>
                    Choose Files
                    <input
                      accept="image/*"
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </Button>

                  <Typography color="text.secondary" variant="body2">
                    {images.length} image(s) uploaded
                  </Typography>

                  {errors.images && (
                    <Typography color="error" variant="body2" sx={{ ml: 2 }}>
                      {errors.images}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {images.map((img, idx) => (
                      <Grid item xs={12} md={6} key={img.id}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                          <Avatar variant="rounded" src={img.url} sx={{ width: 96, height: 96 }} />
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              label="Alt Text"
                              value={img.alt || ""}
                              onChange={(e) => updateImageAlt(img.id, e.target.value)}
                              fullWidth
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <TextField
                              label="Sort Order"
                              value={String(img.sortOrder ?? idx)}
                              onChange={(e) => {
                                const val = Number(e.target.value || 0);
                                setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, sortOrder: val } : p)));
                              }}
                              size="small"
                              type="number"
                              sx={{ width: 140, mr: 1 }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => moveImage(idx, -1)}>
                                      <ArrowBackIosNewIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => moveImage(idx, 1)}>
                                      <ArrowForwardIosIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Button
                              variant={img.isDefault ? "contained" : "outlined"}
                              size="small"
                              onClick={() => setDefaultImage(img.id)}
                            >
                              {img.isDefault ? "Default" : "Set default"}
                            </Button>
                            <Button color="error" variant="outlined" startIcon={<DeleteIcon />} size="small" onClick={() => removeImage(img.id)}>
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Existing Sports</Typography>
                <Paper variant="outlined" sx={{ mt: 1, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Sport Name</TableCell>
                        <TableCell>Dimension</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Rate Per Hour</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">No sports added</TableCell>
                        </TableRow>
                      ) : (
                        sports.map((r, idx) => (
                          <TableRow key={r.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{r.sportName}</TableCell>
                            <TableCell>{r.dimension}</TableCell>
                            <TableCell>{r.capacity}</TableCell>
                            <TableCell>{r.ratePerHour}</TableCell>
                            <TableCell>{r.status}</TableCell>
                            <TableCell>
                              <Button size="small" color="error" onClick={() => removeSportRow(r.id)}>Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  value={sportForm.sportName}
                  onChange={(e) => setSportForm((f) => ({ ...f, sportName: e.target.value }))}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select Sport Type</em></MenuItem>
                  {sportOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Capacity"
                  value={String(sportForm.capacity ?? "")}
                  onChange={(e) => setSportForm((f) => ({ ...f, capacity: e.target.value === "" ? "" : Number(e.target.value) }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField label="Dimension" value={sportForm.dimension} onChange={(e) => setSportForm((f) => ({ ...f, dimension: e.target.value }))} fullWidth />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Rate Per Hours"
                  value={String(sportForm.ratePerHour ?? "")}
                  onChange={(e) => setSportForm((f) => ({ ...f, ratePerHour: e.target.value === "" ? "" : Number(e.target.value) }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Select
                  fullWidth
                  value={sportForm.status}
                  onChange={(e) => setSportForm((f) => ({ ...f, status: e.target.value as any }))}
                >
                  <MenuItem value="Available">Active</MenuItem>
                  <MenuItem value="Unavailable">Inactive</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" onClick={addSportRow}>Add Sport</Button>
                <Button variant="outlined" color="secondary" onClick={() => { setSports([]); }}>Clear All</Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Box>
            <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIosNewIcon />}>
              Back
            </Button>
          </Box>

          <Box>
            {activeStep < STEPS.length - 1 && (
              <Button variant="contained" onClick={handleNext} sx={{ mr: 2 }}>
                Next
              </Button>
            )}

            {activeStep === STEPS.length - 1 ? (
              <Button variant="contained" startIcon={<SaveIcon />} color="primary" onClick={handleSubmitAll}>
                Save Turf
              </Button>
            ) : null}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
