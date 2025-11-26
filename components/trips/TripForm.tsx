'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { TRIP_MOODS, type TripFormData, type Trip, type TripMood } from '@/types/trip';

interface TripFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TripFormData) => Promise<void>;
    initialData?: Partial<Trip>;
    isEditing?: boolean;
}

export default function TripForm({
    open,
    onClose,
    onSubmit,
    initialData,
    isEditing = false,
}: TripFormProps) {
    const [formData, setFormData] = useState<TripFormData>({
        country: initialData?.country || '',
        city: initialData?.city || '',
        start_date: initialData?.start_date || '',
        end_date: initialData?.end_date || '',
        mood: (initialData?.mood as TripMood) || undefined,
        lat: initialData?.lat || undefined,
        lng: initialData?.lng || undefined,
        description: initialData?.description || '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (field: keyof TripFormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors([]);
    };

    const handleSubmit = async () => {

    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEditing ? 'Modifier le voyage' : 'Nouveau voyage'}
            </DialogTitle>

            <DialogContent dividers>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        {errors.length > 0 && (
                            <Alert severity="error">
                                {errors.map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </Alert>
                        )}

                        <TextField
                            label="Pays"
                            value={formData.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            required
                            fullWidth
                            placeholder="Ex: Argentine"
                        />

                        <TextField
                            label="Ville principale"
                            value={formData.city || ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            fullWidth
                            placeholder="Ex: Buenos Aires"
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date de début"
                                    value={formData.start_date ? new Date(formData.start_date) : null}
                                    onChange={(date) =>
                                        handleChange(
                                            'start_date',
                                            date ? date.toISOString().split('T')[0] : ''
                                        )
                                    }
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date de fin"
                                    value={formData.end_date ? new Date(formData.end_date) : null}
                                    onChange={(date) =>
                                        handleChange(
                                            'end_date',
                                            date ? date.toISOString().split('T')[0] : ''
                                        )
                                    }
                                    minDate={
                                        formData.start_date ? new Date(formData.start_date) : undefined
                                    }
                                    slotProps={{
                                        textField: { fullWidth: true },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <FormControl fullWidth>
                            <InputLabel>Humeur globale</InputLabel>
                            <Select
                                value={formData.mood || ''}
                                label="Humeur globale"
                                onChange={(e) => handleChange('mood', e.target.value as TripMood)}
                            >
                                <MenuItem value="">
                                    <em>Non définie</em>
                                </MenuItem>
                                {TRIP_MOODS.map((mood) => (
                                    <MenuItem key={mood.value} value={mood.value}>
                                        {mood.emoji} {mood.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Latitude"
                                    type="number"
                                    value={formData.lat || ''}
                                    onChange={(e) =>
                                        handleChange('lat', parseFloat(e.target.value) || undefined)
                                    }
                                    fullWidth
                                    inputProps={{ step: 'any' }}
                                    placeholder="Ex: -34.6037"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Longitude"
                                    type="number"
                                    value={formData.lng || ''}
                                    onChange={(e) =>
                                        handleChange('lng', parseFloat(e.target.value) || undefined)
                                    }
                                    fullWidth
                                    inputProps={{ step: 'any' }}
                                    placeholder="Ex: -58.3816"
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Description"
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Décrivez votre voyage en quelques mots..."
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Annuler
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {isEditing ? 'Enregistrer' : 'Créer le voyage'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
