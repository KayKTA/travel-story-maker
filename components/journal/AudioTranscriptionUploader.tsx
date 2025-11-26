'use client';

import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    Alert,
    Paper,
    IconButton,
    Stack,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Mic as MicIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { ACCEPTED_AUDIO_TYPES, MAX_FILE_SIZE } from '@/lib/utils/constants';
import { validateAudioFile } from '@/lib/utils/validators';
import { formatFileSize } from '@/lib/utils/formatters';

interface AudioTranscriptionUploaderProps {
    onTranscriptionComplete: (text: string) => void;
}

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'transcribing' | 'completed' | 'error';

export default function AudioTranscriptionUploader({
    onTranscriptionComplete,
}: AudioTranscriptionUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        // Validate file
        const validation = validateAudioFile(selectedFile);
        if (!validation.valid) {
            setError(validation.errors.join(', '));
            return;
        }

        setFile(selectedFile);
        setStatus('selected');
        setError(null);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (!droppedFile) return;

        const validation = validateAudioFile(droppedFile);
        if (!validation.valid) {
            setError(validation.errors.join(', '));
            return;
        }

        setFile(droppedFile);
        setStatus('selected');
        setError(null);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const handleClear = () => {
        setFile(null);
        setStatus('idle');
        setProgress(0);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleTranscribe = async () => {
        if (!file) return;

        setStatus('uploading');
        setProgress(20);

        try {
            // Create FormData with the audio file
            const formData = new FormData();
            formData.append('audio', file);

            setProgress(40);
            setStatus('transcribing');

            // Call the transcription API
            const response = await fetch('/api/journal/transcribe', {
                method: 'POST',
                body: formData,
            });

            setProgress(80);

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Échec de la transcription');
            }

            setProgress(100);
            setStatus('completed');

            // Pass the transcribed text to parent
            onTranscriptionComplete(result.text);
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const acceptedTypes = ACCEPTED_AUDIO_TYPES.join(',');

    return (
        <Box>
            <input
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="audio-upload-input"
            />

            {status === 'idle' && (
                <Paper
                    variant="outlined"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: 'grey.300',
                        bgcolor: 'grey.50',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                        },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <MicIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Glissez un fichier audio ici ou cliquez pour sélectionner
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Formats acceptés: MP3, WAV, M4A, AAC, OGG
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Taille max: {formatFileSize(MAX_FILE_SIZE.AUDIO)}
                    </Typography>
                </Paper>
            )}

            {file && status !== 'idle' && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        {/* File info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: status === 'completed' ? 'success.100' : 'primary.100',
                                    color: status === 'completed' ? 'success.main' : 'primary.main',
                                }}
                            >
                                {status === 'completed' ? (
                                    <CheckIcon />
                                ) : (
                                    <MicIcon />
                                )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {file.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatFileSize(file.size)}
                                </Typography>
                            </Box>
                            {status === 'selected' && (
                                <IconButton onClick={handleClear} size="small">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>

                        {/* Progress */}
                        {(status === 'uploading' || status === 'transcribing') && (
                            <Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ mb: 1, borderRadius: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    {status === 'uploading' ? 'Envoi du fichier...' : 'Transcription en cours...'}
                                </Typography>
                            </Box>
                        )}

                        {/* Status messages */}
                        {status === 'completed' && (
                            <Alert severity="success">
                                Transcription terminée ! Le texte a été ajouté au contenu.
                            </Alert>
                        )}

                        {/* Actions */}
                        {status === 'selected' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClear}
                                    sx={{ flex: 1 }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleTranscribe}
                                    startIcon={<UploadIcon />}
                                    sx={{ flex: 1 }}
                                >
                                    Transcrire
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
