'use client';

import { useState, useEffect } from 'react';
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
import { validateTrip } from '@/lib/utils/validators';
import { useBreakpoint } from '@/lib/hooks';
import { tokens } from '@/styles';

interface TripFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TripFormData) => Promise<void>;
    initialData?: Partial<Trip>;
    isEditing?: boolean;
}

const EMPTY_FORM_DATA: TripFormData = {
    country: '',
    city: '',
    start_date: '',
    end_date: '',
    mood: undefined,
    lat: undefined,
    lng: undefined,
    description: '',
};

// Z-index for popovers above dialog
const POPPER_Z_INDEX = { sx: { zIndex: tokens.zIndex.tooltip } };

export default function TripForm({
    open,
    onClose,
    onSubmit,
    initialData,
    isEditing = false,
}: TripFormProps) {
    const { isMobile } = useBreakpoint();

    const [formData, setFormData] = useState<TripFormData>(EMPTY_FORM_DATA);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    country: initialData.country || '',
                    city: initialData.city || '',
                    start_date: initialData.start_date || '',
                    end_date: initialData.end_date || '',
                    mood: (initialData.mood as TripMood) || undefined,
                    lat: initialData.lat ?? undefined,
                    lng: initialData.lng ?? undefined,
                    description: initialData.description || '',
                });
            } else {
                setFormData(EMPTY_FORM_DATA);
            }
            setErrors([]);
        }
    }, [open, initialData]);

    const handleChange = <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors([]);
    };

    const handleClose = () => {
        if (!loading) {
            setFormData(EMPTY_FORM_DATA);
            setErrors([]);
            onClose();
        }
    };

    const handleSubmit = async () => {
        const validation = validateTrip(formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData(EMPTY_FORM_DATA);
            onClose();
        } catch {
            setErrors(['Une erreur est survenue. Veuillez réessayer.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            maxWidth="sm"
            fullWidth
            disablePortal={false}
            sx={{
                '& .MuiDialog-paper': {
                    overflow: 'visible',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: tokens.fontWeights.bold }}>
                {isEditing ? 'Modifier le voyage' : 'Nouveau voyage'}
            </DialogTitle>

            <DialogContent dividers sx={{ overflow: 'visible' }}>
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
                            autoFocus
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
                                        handleChange('start_date', date ? date.toISOString().split('T')[0] : '')
                                    }
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                        popper: { ...POPPER_Z_INDEX, placement: 'bottom-start' },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date de fin"
                                    value={formData.end_date ? new Date(formData.end_date) : null}
                                    onChange={(date) =>
                                        handleChange('end_date', date ? date.toISOString().split('T')[0] : '')
                                    }
                                    minDate={formData.start_date ? new Date(formData.start_date) : undefined}
                                    slotProps={{
                                        textField: { fullWidth: true },
                                        popper: { ...POPPER_Z_INDEX, placement: 'bottom-start' },
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
                                MenuProps={{
                                    ...POPPER_Z_INDEX,
                                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                                }}
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
                                    value={formData.lat ?? ''}
                                    onChange={(e) =>
                                        handleChange('lat', e.target.value ? parseFloat(e.target.value) : undefined)
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
                                    value={formData.lng ?? ''}
                                    onChange={(e) =>
                                        handleChange('lng', e.target.value ? parseFloat(e.target.value) : undefined)
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
                <Button onClick={handleClose} disabled={loading}>
                    Annuler
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {isEditing ? 'Enregistrer' : 'Créer le voyage'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
