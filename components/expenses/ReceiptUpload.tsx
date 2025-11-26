'use client';

import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    Alert,
    Paper,
    CircularProgress,
} from '@mui/material';
import {
    CameraAlt as CameraIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/utils/constants';
import { validateReceiptFile } from '@/lib/utils/validators';
import { formatFileSize } from '@/lib/utils/formatters';
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '@/lib/supabase/client';
import type { ExpenseFormData, ReceiptExtractionResponse } from '@/types';

interface ReceiptUploadProps {
    onExtracted: (data: Partial<ExpenseFormData>) => void;
    tripId?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'completed' | 'error';

export default function ReceiptUpload({ onExtracted, tripId }: ReceiptUploadProps) {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate
        const validation = validateReceiptFile(file);
        if (!validation.valid) {
            setError(validation.errors.join(', '));
            return;
        }

        // Create preview
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setStatus('uploading');
        setProgress(20);

        try {
            // Upload to Supabase Storage
            const filename = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
            const { path, error: uploadError } = await uploadFile(
                STORAGE_BUCKETS.RECEIPTS,
                filename,
                file
            );

            if (uploadError) {
                throw uploadError;
            }

            setProgress(50);
            setStatus('extracting');

            // Get public URL
            const imageUrl = getPublicUrl(STORAGE_BUCKETS.RECEIPTS, path);

            // Call OCR API
            const response = await fetch('/api/expenses/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl }),
            });

            const result: ReceiptExtractionResponse = await response.json();

            setProgress(100);

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Extraction failed');
            }

            setStatus('completed');

            // Pass extracted data to parent
            onExtracted({
                trip_id: tripId,
                amount: result.data.amount,
                currency: result.data.currency,
                date: result.data.date,
                label: result.data.label,
                category: result.data.category,
                receipt_image_url: imageUrl,
            });
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setProgress(0);
        setError(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const acceptedTypes = ACCEPTED_IMAGE_TYPES.join(',');

    return (
        <Box>
            <input
                type="file"
                accept={acceptedTypes}
                capture="environment"
                onChange={handleFileSelect}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="receipt-upload-input"
            />

            {status === 'idle' && (
                <Paper
                    variant="outlined"
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
                    <CameraIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Photographiez ou uploadez un ticket
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        L'IA extraira automatiquement les informations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Taille max: {formatFileSize(MAX_FILE_SIZE.RECEIPT)}
                    </Typography>
                </Paper>
            )}

            {status !== 'idle' && (
                <Paper variant="outlined" sx={{ p: 3 }}>
                    {/* Preview */}
                    {previewUrl && (
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src={previewUrl}
                                alt="Receipt preview"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    borderRadius: 2,
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                    )}

                    {/* Progress */}
                    {(status === 'uploading' || status === 'extracting') && (
                        <Box sx={{ textAlign: 'center' }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ mb: 2, borderRadius: 1 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">
                                    {status === 'uploading' ? 'Upload en cours...' : 'Extraction des données...'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Success */}
                    {status === 'completed' && (
                        <Alert
                            severity="success"
                            action={
                                <Button color="inherit" size="small" onClick={handleReset}>
                                    Nouveau scan
                                </Button>
                            }
                        >
                            Données extraites avec succès ! Vérifiez le formulaire ci-dessous.
                        </Alert>
                    )}

                    {/* Error */}
                    {status === 'error' && (
                        <Alert
                            severity="error"
                            action={
                                <Button color="inherit" size="small" onClick={handleReset}>
                                    Réessayer
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}
                </Paper>
            )}

            {error && status === 'idle' && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
