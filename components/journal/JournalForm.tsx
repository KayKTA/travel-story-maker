'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress,
    Typography,
    IconButton,
    Chip,
    Paper,
    Collapse,
    LinearProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import {
    Close as CloseIcon,
    PhotoCamera as PhotoIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    LocationOn as LocationIcon,
    Delete as DeleteIcon,
    AutoAwesome as AutoIcon,
    Check as CheckIcon,
    Add as AddIcon,
    PlayCircle as PlayIcon,
} from '@mui/icons-material';
import exifr from 'exifr';
import { JOURNAL_MOODS, type JournalEntryFormData, type JournalMood } from '@/types/journal';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatFileSize } from '@/lib/utils/formatters';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES } from '@/lib/utils/constants';

interface JournalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: JournalEntryFormData, mediaAssetIds?: string[]) => Promise<void>;
    tripId: string;
    tripName?: string;
}

interface MediaFile {
    id: string;
    file: File;
    preview: string;
    type: 'photo' | 'video';
    status: 'pending' | 'uploading' | 'completed' | 'error';
    progress: number;
    metadata: {
        takenAt: Date | null;
        lat: number | null;
        lng: number | null;
        location: string | null;
    } | null;
    error?: string;
}

// Reverse geocoding to get location name from coordinates
const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`
        );
        const data = await response.json();
        const address = data.address;
        return address?.city || address?.town || address?.village ||
            address?.municipality || address?.county || null;
    } catch {
        return null;
    }
};

// Extract metadata from image using exifr
const extractMetadata = async (file: File): Promise<MediaFile['metadata']> => {
    const metadata: MediaFile['metadata'] = {
        takenAt: null,
        lat: null,
        lng: null,
        location: null,
    };

    try {
        if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|heic|heif)$/i.test(file.name)) {
            const exif = await exifr.parse(file, { gps: true, exif: true });

            if (exif) {
                if (exif.DateTimeOriginal) {
                    metadata.takenAt = new Date(exif.DateTimeOriginal);
                } else if (exif.CreateDate) {
                    metadata.takenAt = new Date(exif.CreateDate);
                }

                if (exif.latitude && exif.longitude) {
                    metadata.lat = exif.latitude;
                    metadata.lng = exif.longitude;
                    metadata.location = await reverseGeocode(exif.latitude, exif.longitude);
                }
            }
        }

        if (!metadata.takenAt && file.lastModified) {
            metadata.takenAt = new Date(file.lastModified);
        }
    } catch (error) {
        console.warn('Error extracting metadata:', error);
    }

    return metadata;
};

const generateId = () => Math.random().toString(36).substring(2, 12);

export default function JournalForm({
    open,
    onClose,
    onSubmit,
    tripId,
    tripName,
}: JournalFormProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [date, setDate] = useState<Date>(new Date());
    const [location, setLocation] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<JournalMood | null>(null);
    const [tags, setTags] = useState('');

    // Media state
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [extractingMetadata, setExtractingMetadata] = useState(false);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioTranscribing, setAudioTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);

    // Reset form on open
    useEffect(() => {
        if (open) {
            setDate(new Date());
            setLocation('');
            setLat(null);
            setLng(null);
            setContent('');
            setMood(null);
            setTags('');
            setMediaFiles([]);
            setErrors([]);
            setAutoFilledFields([]);
        }
    }, [open]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
        };
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setExtractingMetadata(true);
        const newAutoFilled: string[] = [];

        const newFiles: MediaFile[] = await Promise.all(
            Array.from(files).slice(0, 20 - mediaFiles.length).map(async (file) => {
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                let error: string | undefined;
                if (isImage && file.size > MAX_FILE_SIZE.IMAGE) {
                    error = `Trop volumineux (max ${formatFileSize(MAX_FILE_SIZE.IMAGE)})`;
                } else if (isVideo && file.size > MAX_FILE_SIZE.VIDEO) {
                    error = `Trop volumineux (max ${formatFileSize(MAX_FILE_SIZE.VIDEO)})`;
                } else if (!isImage && !isVideo) {
                    error = 'Format non supporté';
                }

                const metadata = error ? null : await extractMetadata(file);

                return {
                    id: generateId(),
                    file,
                    preview: URL.createObjectURL(file),
                    type: isImage ? 'photo' : 'video',
                    status: error ? 'error' : 'pending',
                    progress: 0,
                    metadata,
                    error,
                } as MediaFile;
            })
        );

        // Auto-fill form from first file with metadata
        const fileWithMetadata = newFiles.find((f) => f.metadata?.takenAt || f.metadata?.lat);

        if (fileWithMetadata?.metadata) {
            const m = fileWithMetadata.metadata;

            // Auto-fill date if it's still today
            if (m.takenAt && date.toDateString() === new Date().toDateString()) {
                setDate(m.takenAt);
                newAutoFilled.push('date');
            }

            // Auto-fill location
            if (m.lat && m.lng && !lat && !lng) {
                setLat(m.lat);
                setLng(m.lng);
                newAutoFilled.push('gps');

                if (m.location && !location) {
                    setLocation(m.location);
                    newAutoFilled.push('lieu');
                }
            }
        }

        if (newAutoFilled.length > 0) {
            setAutoFilledFields(newAutoFilled);
            setTimeout(() => setAutoFilledFields([]), 3000);
        }

        setMediaFiles((prev) => [...prev, ...newFiles]);
        setExtractingMetadata(false);
    }, [mediaFiles.length, date, lat, lng, location]);

    // Remove media file
    const handleRemoveMedia = (id: string) => {
        const file = mediaFiles.find((f) => f.id === id);
        if (file) {
            URL.revokeObjectURL(file.preview);
            setMediaFiles((prev) => prev.filter((f) => f.id !== id));
        }
    };

    // Audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach((track) => track.stop());

                setAudioTranscribing(true);
                try {
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    const response = await fetch('/api/transcribe', {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();
                    if (result.success && result.text) {
                        setContent((prev) => prev ? `${prev}\n\n${result.text}` : result.text);
                    }
                } catch (error) {
                    console.error('Transcription error:', error);
                }
                setAudioTranscribing(false);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Recording error:', error);
            setErrors(['Impossible d\'accéder au microphone']);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Upload media to Supabase
    const uploadMedia = async (journalEntryId: string): Promise<string[]> => {
        const supabase = getSupabaseClient();
        const ids: string[] = [];

        for (const media of mediaFiles) {
            if (media.status !== 'pending') continue;

            setMediaFiles((prev) =>
                prev.map((f) => f.id === media.id ? { ...f, status: 'uploading', progress: 20 } : f)
            );

            try {
                const ext = media.file.name.split('.').pop()?.toLowerCase() || 'jpg';
                const filename = `${tripId}/${media.type}s/${Date.now()}_${generateId()}.${ext}`;

                const { data, error } = await supabase.storage
                    .from('media')
                    .upload(filename, media.file);

                if (error) throw error;

                setMediaFiles((prev) =>
                    prev.map((f) => f.id === media.id ? { ...f, progress: 60 } : f)
                );

                const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);

                const { data: asset, error: assetError } = await supabase
                    .from('media_assets')
                    .insert({
                        trip_id: tripId,
                        journal_entry_id: journalEntryId,
                        media_type: media.type,
                        url: urlData.publicUrl,
                        taken_at: media.metadata?.takenAt?.toISOString() || null,
                        lat: media.metadata?.lat || null,
                        lng: media.metadata?.lng || null,
                        file_size_bytes: media.file.size,
                    })
                    .select()
                    .single();

                if (assetError) throw assetError;

                ids.push(asset.id);

                setMediaFiles((prev) =>
                    prev.map((f) => f.id === media.id ? { ...f, status: 'completed', progress: 100 } : f)
                );
            } catch (error) {
                setMediaFiles((prev) =>
                    prev.map((f) => f.id === media.id ? { ...f, status: 'error', error: 'Échec upload' } : f)
                );
            }
        }

        return ids;
    };

    // Submit
    const handleSubmit = async () => {
        if (!content.trim()) {
            setErrors(['Décrivez votre journée']);
            return;
        }

        setLoading(true);
        setErrors([]);

        try {
            const supabase = getSupabaseClient();

            const { data: entry, error: entryError } = await supabase
                .from('journal_entries')
                .insert({
                    trip_id: tripId,
                    entry_date: date.toISOString().split('T')[0],
                    location: location || null,
                    lat: lat || null,
                    lng: lng || null,
                    mood: mood || null,
                    content: content.trim(),
                    content_source: 'typed',
                    tags: tags || null,
                })
                .select()
                .single();

            if (entryError) throw entryError;

            let mediaIds: string[] = [];
            if (mediaFiles.filter((f) => f.status === 'pending').length > 0) {
                mediaIds = await uploadMedia(entry.id);
            }

            await onSubmit({
                trip_id: tripId,
                entry_date: date.toISOString().split('T')[0],
                location,
                lat: lat || undefined,
                lng: lng || undefined,
                mood: mood || undefined,
                content: content.trim(),
                content_source: 'typed',
                tags,
            }, mediaIds);

            mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            setErrors(['Une erreur est survenue']);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
            onClose();
        }
    };

    const pendingMediaCount = mediaFiles.filter((f) => f.status === 'pending').length;
    const hasGps = lat !== null && lng !== null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100%' : '90vh',
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'primary.main',
                    color: 'white',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Nouvelle entrée
                    </Typography>
                    {tripName && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {tripName}
                        </Typography>
                    )}
                </Box>
                <IconButton onClick={handleClose} disabled={loading} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <input
                        type="file"
                        accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')}
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />

                    {/* Photo Upload Zone */}
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                        {mediaFiles.length === 0 ? (
                            <Paper
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: 'primary.50',
                                        borderColor: 'primary.dark',
                                    },
                                }}
                            >
                                <PhotoIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
                                    Ajoutez vos photos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    La date et le lieu seront extraits automatiquement
                                </Typography>
                            </Paper>
                        ) : (
                            <Box>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: 'repeat(2, 1fr)',
                                            sm: 'repeat(3, 1fr)',
                                            md: 'repeat(4, 1fr)',
                                        },
                                        gap: 1,
                                        mb: 1,
                                    }}
                                >
                                    {mediaFiles.map((media) => (
                                        <Box
                                            key={media.id}
                                            sx={{
                                                position: 'relative',
                                                paddingTop: '100%',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                bgcolor: 'grey.200',
                                            }}
                                        >
                                            {media.type === 'photo' ? (
                                                <img
                                                    src={media.preview}
                                                    alt=""
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'grey.800',
                                                    }}
                                                >
                                                    <PlayIcon sx={{ fontSize: 32, color: 'white' }} />
                                                </Box>
                                            )}

                                            {media.status === 'uploading' && (
                                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                                    <LinearProgress variant="determinate" value={media.progress} />
                                                </Box>
                                            )}
                                            {media.status === 'completed' && (
                                                <CheckIcon
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        left: 4,
                                                        fontSize: 18,
                                                        color: 'success.main',
                                                        bgcolor: 'white',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            )}

                                            {media.status !== 'uploading' && !loading && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveMedia(media.id)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 2,
                                                        right: 2,
                                                        bgcolor: 'rgba(0,0,0,0.5)',
                                                        color: 'white',
                                                        p: 0.5,
                                                        '&:hover': { bgcolor: 'error.main' },
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}

                                    {mediaFiles.length < 20 && (
                                        <Box
                                            onClick={() => fileInputRef.current?.click()}
                                            sx={{
                                                paddingTop: '100%',
                                                position: 'relative',
                                                borderRadius: 1,
                                                border: '2px solid',
                                                borderColor: 'grey.300',
                                                cursor: 'pointer',
                                                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                                            }}
                                        >
                                            <AddIcon
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: 'grey.400',
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {extractingMetadata && (
                                    <Typography variant="caption" color="text.secondary">
                                        <CircularProgress size={12} sx={{ mr: 1 }} />
                                        Extraction des métadonnées...
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Collapse in={autoFilledFields.length > 0}>
                            <Alert severity="success" icon={<AutoIcon />} sx={{ mt: 1 }}>
                                Rempli automatiquement : {autoFilledFields.join(', ')}
                            </Alert>
                        </Collapse>
                    </Box>

                    {/* Form fields */}
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {errors.length > 0 && (
                            <Alert severity="error">{errors.join(', ')}</Alert>
                        )}

                        {/* Date & Location */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(d) => d && setDate(d)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        InputProps: {
                                            sx: autoFilledFields.includes('date') ? { bgcolor: 'success.50' } : {},
                                        },
                                    },
                                    popper: { sx: { zIndex: 1500 } },
                                }}
                            />
                            <TextField
                                label="Lieu"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder="Ville, lieu..."
                                InputProps={{
                                    sx: autoFilledFields.includes('lieu') ? { bgcolor: 'success.50' } : {},
                                    endAdornment: hasGps && (
                                        <LocationIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                    ),
                                }}
                            />
                        </Box>

                        {/* Mood */}
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Comment s'est passée cette journée ?
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {JOURNAL_MOODS.map((m) => (
                                    <Chip
                                        key={m.value}
                                        label={`${m.emoji} ${m.label}`}
                                        onClick={() => setMood(mood === m.value ? null : m.value)}
                                        variant={mood === m.value ? 'filled' : 'outlined'}
                                        color={mood === m.value ? 'primary' : 'default'}
                                        sx={{
                                            transition: 'all 0.2s',
                                            ...(mood === m.value && { bgcolor: `${m.color}30`, borderColor: m.color }),
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Content with voice */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Racontez votre journée
                                </Typography>
                                <Button
                                    size="small"
                                    variant={isRecording ? 'contained' : 'outlined'}
                                    color={isRecording ? 'error' : 'primary'}
                                    startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled
                                    // disabled={audioTranscribing}
                                >
                                    {isRecording ? 'Arrêter' : 'Dicter'}
                                </Button>
                            </Box>

                            {audioTranscribing && (
                                <Alert severity="info" sx={{ mb: 1 }}>
                                    <CircularProgress size={14} sx={{ mr: 1 }} />
                                    Transcription en cours...
                                </Alert>
                            )}

                            <TextField
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Qu'avez-vous fait aujourd'hui ? Vos impressions, découvertes, anecdotes..."
                                variant="outlined"
                            />
                        </Box>

                        {/* Tags */}
                        <TextField
                            label="Tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            size="small"
                            fullWidth
                            placeholder="plage, restaurant, randonnée..."
                            helperText="Séparés par des virgules"
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>

            {/* Submit */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading || !content.trim()}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ py: 1.5, borderRadius: 2 }}
                >
                    {loading
                        ? 'Enregistrement...'
                        : pendingMediaCount > 0
                            ? `Enregistrer avec ${pendingMediaCount} média${pendingMediaCount > 1 ? 's' : ''}`
                            : 'Enregistrer'
                    }
                </Button>
            </Box>
        </Dialog>
    );
}
