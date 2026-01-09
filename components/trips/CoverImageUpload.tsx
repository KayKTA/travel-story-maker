'use client';

import { useState, useRef } from 'react';
import {
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Avatar,
} from '@mui/material';
import {
    AddAPhoto as AddPhotoIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { tokens, flexCenter } from '@/styles';
import { useUploadCoverImage, useDeleteCoverImage } from '@/lib/hooks';

interface CoverImageUploadProps {
    tripId: string;
    currentImageUrl?: string | null;
    onUploadComplete?: (imageUrl: string) => void;
    onRemove?: () => void;
    variant?: 'button' | 'overlay';
}

export default function CoverImageUpload({
    tripId,
    currentImageUrl,
    onUploadComplete,
    onRemove,
    variant = 'button',
}: CoverImageUploadProps) {
    const uploadCoverImage = useUploadCoverImage();
    const deleteCoverImage = useDeleteCoverImage();

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner une image');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 10 Mo');
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setError(null);

        try {
            const imageUrl = await uploadCoverImage.mutateAsync({
                file: selectedFile,
                tripId,
            });
            onUploadComplete?.(imageUrl);
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
        }
    };

    const handleRemove = async () => {
        setError(null);

        try {
            await deleteCoverImage.mutateAsync(tripId);
            onRemove?.();
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setPreview(null);
        setSelectedFile(null);
        setError(null);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    // Render trigger button based on variant
    const renderTrigger = () => {
        if (variant === 'overlay') {
            return (
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper', transform: 'scale(1.05)' },
                    }}
                >
                    {currentImageUrl ? <EditIcon /> : <AddPhotoIcon />}
                </IconButton>
            );
        }

        return (
            <Button
                variant="outlined"
                startIcon={currentImageUrl ? <EditIcon /> : <AddPhotoIcon />}
                onClick={handleOpen}
                size="small"
                sx={{
                    borderColor: 'primary.contrastText',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', borderColor: 'primary.contrastText' },
                }}
            >
                {currentImageUrl ? 'Modifier la couverture' : 'Ajouter une couverture'}
            </Button>
        );
    };

    return (
        <>
            {renderTrigger()}

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ ...flexCenter, justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: tokens.fontWeights.bold }}>
                        Image de couverture
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {/* Current or preview image */}
                    <Box
                        sx={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: 'action.hover',
                            mb: 2,
                            position: 'relative',
                            ...flexCenter,
                        }}
                    >
                        {preview || currentImageUrl ? (
                            <Box
                                component="img"
                                src={preview || currentImageUrl || ''}
                                alt="Cover preview"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                <AddPhotoIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                                <Typography color="text.secondary">
                                    Aucune image de couverture
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Upload zone */}
                    <Box
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            border: 2,
                            borderStyle: 'dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: tokens.transitions.fast,
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <UploadIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.medium }}>
                            Cliquez pour sélectionner une image
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            JPG, PNG ou WebP • Max 10 Mo
                        </Typography>
                    </Box>

                    {/* Error message */}
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {/* Selected file info */}
                    {selectedFile && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Fichier sélectionné : {selectedFile.name}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    {currentImageUrl && !preview && (
                        <Button
                            onClick={handleRemove}
                            color="error"
                            disabled={uploadCoverImage.isPending || deleteCoverImage.isPending}
                            startIcon={<DeleteIcon />}
                        >
                            Supprimer
                        </Button>
                    )}
                    <Box sx={{ flex: 1 }} />
                    <Button onClick={handleClose} disabled={uploadCoverImage.isPending || deleteCoverImage.isPending}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        disabled={!selectedFile || uploadCoverImage.isPending || deleteCoverImage.isPending}
                        startIcon={(uploadCoverImage.isPending || deleteCoverImage.isPending) ? <CircularProgress size={16} /> : <UploadIcon />}
                    >
                        {(uploadCoverImage.isPending || deleteCoverImage.isPending) ? 'Upload...' : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
