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
    Tabs,
    Tab,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { Edit as EditIcon, Mic as MicIcon } from '@mui/icons-material';
import AudioTranscriptionUploader from './AudioTranscriptionUploader';
import { JOURNAL_MOODS, type JournalEntryFormData, type JournalMood } from '@/types/journal';
import { validateJournalEntry } from '@/lib/utils/validators';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Trip } from '@/types';

interface JournalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: JournalEntryFormData) => Promise<void>;
    tripId?: string;
    initialData?: Partial<JournalEntryFormData>;
    isEditing?: boolean;
}

const emptyFormData: JournalEntryFormData = {
    trip_id: '',
    entry_date: new Date().toISOString().split('T')[0],
    location: '',
    lat: undefined,
    lng: undefined,
    mood: undefined,
    content: '',
    content_source: 'typed',
    tags: '',
};

// Common MenuProps for Select components to fix z-index
const selectMenuProps = {
    sx: { zIndex: 1500 },
    anchorOrigin: {
        vertical: 'bottom' as const,
        horizontal: 'left' as const,
    },
    transformOrigin: {
        vertical: 'top' as const,
        horizontal: 'left' as const,
    },
};

// Common popper props for DatePicker to fix z-index
const datePickerPopperProps = {
    sx: { zIndex: 1500 },
    placement: 'bottom-start' as const,
};

export default function JournalForm({
    open,
    onClose,
    onSubmit,
    tripId,
    initialData,
    isEditing = false,
}: JournalFormProps) {
    const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [formData, setFormData] = useState<JournalEntryFormData>(emptyFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setInputMode('text');
            setErrors([]);

            if (initialData) {
                setFormData({
                    trip_id: tripId || initialData.trip_id || '',
                    entry_date: initialData.entry_date || new Date().toISOString().split('T')[0],
                    location: initialData.location || '',
                    lat: initialData.lat,
                    lng: initialData.lng,
                    mood: initialData.mood,
                    content: initialData.content || '',
                    content_source: initialData.content_source || 'typed',
                    tags: initialData.tags || '',
                });
            } else {
                setFormData({
                    ...emptyFormData,
                    trip_id: tripId || '',
                });
            }
        }
    }, [open, initialData, tripId]);

    // Load trips for selector
    useEffect(() => {
        const loadTrips = async () => {
            const supabase = getSupabaseClient();
            const { data } = await supabase
                .from('trips')
                .select('*')
                .order('start_date', { ascending: false });

            setTrips(data || []);
            setLoadingTrips(false);
        };

        if (open) {
            loadTrips();
        }
    }, [open]);

    const handleChange = (field: keyof JournalEntryFormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors([]);
    };

    const handleClose = () => {
        if (!loading) {
            setFormData(emptyFormData);
            setErrors([]);
            setInputMode('text');
            onClose();
        }
    };

    const handleTranscriptionComplete = (text: string) => {
        setFormData((prev) => ({
            ...prev,
            content: text,
            content_source: 'audio_transcription',
        }));
        setInputMode('text'); // Switch back to text mode to allow editing
    };

    const handleSubmit = async () => {
        const validation = validateJournalEntry(formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData(emptyFormData);
            onClose();
        } catch (error) {
            setErrors(['Une erreur est survenue. Veuillez réessayer.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    overflow: 'visible',
                },
            }}
        >
            <DialogTitle>
                {isEditing ? 'Modifier l\'entrée' : 'Nouvelle entrée de journal'}
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

                        <Grid container spacing={2}>
                            {/* Trip selector */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required disabled={!!tripId}>
                                    <InputLabel>Voyage</InputLabel>
                                    <Select
                                        value={formData.trip_id}
                                        label="Voyage"
                                        onChange={(e) => handleChange('trip_id', e.target.value)}
                                        MenuProps={selectMenuProps}
                                    >
                                        {loadingTrips ? (
                                            <MenuItem disabled>Chargement...</MenuItem>
                                        ) : trips.length === 0 ? (
                                            <MenuItem disabled>Aucun voyage - créez-en un d'abord</MenuItem>
                                        ) : (
                                            trips.map((trip) => (
                                                <MenuItem key={trip.id} value={trip.id}>
                                                    {trip.country}
                                                    {trip.city && ` - ${trip.city}`}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Date */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date"
                                    value={formData.entry_date ? new Date(formData.entry_date) : null}
                                    onChange={(date) =>
                                        handleChange(
                                            'entry_date',
                                            date ? date.toISOString().split('T')[0] : ''
                                        )
                                    }
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                        popper: datePickerPopperProps,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            {/* Location */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Lieu"
                                    value={formData.location || ''}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    fullWidth
                                    placeholder="Ex: Ushuaia"
                                />
                            </Grid>

                            {/* Mood */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Humeur</InputLabel>
                                    <Select
                                        value={formData.mood || ''}
                                        label="Humeur"
                                        onChange={(e) => handleChange('mood', e.target.value as JournalMood)}
                                        MenuProps={selectMenuProps}
                                    >
                                        <MenuItem value="">
                                            <em>Non définie</em>
                                        </MenuItem>
                                        {JOURNAL_MOODS.map((mood) => (
                                            <MenuItem key={mood.value} value={mood.value}>
                                                {mood.emoji} {mood.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Content input mode tabs */}
                        <Box>
                            <Tabs
                                value={inputMode}
                                onChange={(_, v) => setInputMode(v)}
                                sx={{ mb: 2 }}
                            >
                                <Tab
                                    icon={<EditIcon />}
                                    iconPosition="start"
                                    label="Écrire"
                                    value="text"
                                />
                                <Tab
                                    icon={<MicIcon />}
                                    iconPosition="start"
                                    label="Audio → Texte"
                                    value="audio"
                                />
                            </Tabs>

                            {inputMode === 'text' ? (
                                <TextField
                                    label="Contenu"
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    multiline
                                    rows={8}
                                    fullWidth
                                    required
                                    placeholder="Racontez votre journée..."
                                    helperText={
                                        formData.content_source === 'audio_transcription'
                                            ? '✓ Transcrit depuis un audio - vous pouvez éditer le texte'
                                            : undefined
                                    }
                                />
                            ) : (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Uploadez un fichier audio et il sera automatiquement transcrit en texte.
                                    </Typography>
                                    <AudioTranscriptionUploader
                                        onTranscriptionComplete={handleTranscriptionComplete}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Tags */}
                        <TextField
                            label="Tags"
                            value={formData.tags || ''}
                            onChange={(e) => handleChange('tags', e.target.value)}
                            fullWidth
                            placeholder="plage, food, galère (séparés par des virgules)"
                            helperText="Séparez les tags par des virgules"
                        />

                        {/* Coordinates (optional) */}
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
                                />
                            </Grid>
                        </Grid>
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
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {isEditing ? 'Enregistrer' : 'Créer l\'entrée'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
