'use client';

import { useState, useRef, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Alert,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Photo as PhotoIcon,
    Videocam as VideoIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_VIDEO_TYPES,
    MAX_FILE_SIZE,
} from '@/lib/utils/constants';
import { validateImageFile, validateVideoFile, isImageFile, isVideoFile } from '@/lib/utils/validators';
import { formatFileSize } from '@/lib/utils/formatters';
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '@/lib/supabase/client';
import { generateMediaFilename } from '@/lib/utils/exif';
import type { UploadProgress } from '@/types';

interface MediaUploadProps {
    open: boolean;
    onClose: () => void;
    tripId: string;
    journalEntryId?: string;
    onUploadComplete?: () => void;
}

export default function MediaUpload({
    open,
    onClose,
    tripId,
    journalEntryId,
    onUploadComplete,
}: MediaUploadProps) {
    const [files, setFiles] = useState<UploadProgress[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',');

    const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles: UploadProgress[] = Array.from(selectedFiles).map((file) => {
            // Validate file
            let error: string | undefined;
            if (isImageFile(file)) {
                const validation = validateImageFile(file);
                if (!validation.valid) error = validation.errors[0];
            } else if (isVideoFile(file)) {
                const validation = validateVideoFile(file);
                if (!validation.valid) error = validation.errors[0];
            } else {
                error = 'Type de fichier non supporté';
            }

            return {
                file,
                progress: 0,
                status: error ? 'error' : 'pending',
                error,
            } as UploadProgress;
        });

        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    const handleRemove = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        const validFiles = files.filter((f) => f.status === 'pending');
        if (validFiles.length === 0) return;

        setUploading(true);

        for (let i = 0; i < files.length; i++) {
            const fileProgress = files[i];
            if (fileProgress.status !== 'pending') continue;

            // Update status to uploading
            setFiles((prev) =>
                prev.map((f, idx) =>
                    idx === i ? { ...f, status: 'uploading', progress: 10 } : f
                )
            );

            try {
                const mediaType = isImageFile(fileProgress.file) ? 'photo' : 'video';
                const filename = generateMediaFilename(fileProgress.file.name, tripId, mediaType);

                // Upload to storage
                const { path, error: uploadError } = await uploadFile(
                    STORAGE_BUCKETS.MEDIA,
                    filename,
                    fileProgress.file
                );

                if (uploadError) throw uploadError;

                setFiles((prev) =>
                    prev.map((f, idx) => (idx === i ? { ...f, progress: 50 } : f))
                );

                // Get public URL
                const url = getPublicUrl(STORAGE_BUCKETS.MEDIA, path);

                // Extract metadata and create media record
                const response = await fetch('/api/media/extract-metadata', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileUrl: url,
                        mediaType,
                        tripId,
                        journalEntryId,
                        filename: path,
                    }),
                });

                const result = await response.json();

                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? { ...f, status: 'completed', progress: 100, result: result.data }
                            : f
                    )
                );
            } catch (err) {
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? {
                                ...f,
                                status: 'error',
                                error: err instanceof Error ? err.message : 'Upload failed',
                            }
                            : f
                    )
                );
            }
        }

        setUploading(false);
        onUploadComplete?.();
    };

    const handleClose = () => {
        if (!uploading) {
            setFiles([]);
            onClose();
        }
    };

    const pendingCount = files.filter((f) => f.status === 'pending').length;
    const completedCount = files.filter((f) => f.status === 'completed').length;
    const errorCount = files.filter((f) => f.status === 'error').length;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ajouter des médias</DialogTitle>

            <DialogContent dividers>
                <input
                    type="file"
                    accept={acceptedTypes}
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                {/* Dropzone */}
                <Box
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        p: 4,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: 'grey.50',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                        },
                    }}
                >
                    <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                        Glissez vos fichiers ici ou cliquez pour sélectionner
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Photos (max {formatFileSize(MAX_FILE_SIZE.IMAGE)}) •
                        Vidéos (max {formatFileSize(MAX_FILE_SIZE.VIDEO)})
                    </Typography>
                </Box>

                {/* File list */}
                {files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Fichiers sélectionnés ({files.length})
                        </Typography>
                        <List dense>
                            {files.map((fileProgress, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        fileProgress.status !== 'uploading' && (
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => handleRemove(index)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )
                                    }
                                >
                                    <ListItemIcon>
                                        {fileProgress.status === 'completed' ? (
                                            <SuccessIcon color="success" />
                                        ) : fileProgress.status === 'error' ? (
                                            <ErrorIcon color="error" />
                                        ) : isImageFile(fileProgress.file) ? (
                                            <PhotoIcon color="action" />
                                        ) : (
                                            <VideoIcon color="action" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={fileProgress.file.name}
                                        secondary={
                                            fileProgress.error || formatFileSize(fileProgress.file.size)
                                        }
                                        secondaryTypographyProps={{
                                            color: fileProgress.error ? 'error' : 'textSecondary',
                                        }}
                                    />
                                    {fileProgress.status === 'uploading' && (
                                        <Box sx={{ width: 100, ml: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={fileProgress.progress}
                                            />
                                        </Box>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Status summary */}
                {completedCount > 0 && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {completedCount} fichier(s) uploadé(s) avec succès
                    </Alert>
                )}
                {errorCount > 0 && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorCount} fichier(s) en erreur
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} disabled={uploading}>
                    {completedCount > 0 ? 'Fermer' : 'Annuler'}
                </Button>
                {pendingCount > 0 && (
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={uploading ? null : <UploadIcon />}
                    >
                        {uploading
                            ? 'Upload en cours...'
                            : `Uploader ${pendingCount} fichier(s)`}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
