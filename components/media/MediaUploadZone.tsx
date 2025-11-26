'use client';

import { useState, useRef, useCallback } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    IconButton,
    Alert,
    ImageList,
    ImageListItem,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Delete as DeleteIcon,
    PlayCircle as PlayIcon,
} from '@mui/icons-material';
import exifr from 'exifr';
import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_VIDEO_TYPES,
    MAX_FILE_SIZE,
} from '@/lib/utils/constants';
import { formatFileSize } from '@/lib/utils/formatters';
import type { ExifData } from '@/types';

export interface ExtractedMetadata {
    takenAt: Date | null;
    lat: number | null;
    lng: number | null;
    width: number | null;
    height: number | null;
    camera: string | null;
    exifData: ExifData | null;
}

export interface PendingMedia {
    id: string;
    file: File;
    preview: string;
    type: 'photo' | 'video';
    status: 'pending' | 'uploading' | 'completed' | 'error';
    progress: number;
    error?: string;
    metadata: ExtractedMetadata | null;
    mediaAssetId?: string;
    uploadedUrl?: string;
}

interface MediaUploadZoneProps {
    files: PendingMedia[];
    onFilesChange: (files: PendingMedia[]) => void;
    onMetadataExtracted?: (metadata: ExtractedMetadata) => void;
    disabled?: boolean;
    maxFiles?: number;
}

// Helper to check file types
const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);
};

const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name);
};

// Validate file
const validateFile = (file: File): string | null => {
    if (isImageFile(file)) {
        if (file.size > MAX_FILE_SIZE.IMAGE) {
            return `Image trop volumineuse (max ${formatFileSize(MAX_FILE_SIZE.IMAGE)})`;
        }
    } else if (isVideoFile(file)) {
        if (file.size > MAX_FILE_SIZE.VIDEO) {
            return `Vidéo trop volumineuse (max ${formatFileSize(MAX_FILE_SIZE.VIDEO)})`;
        }
    } else {
        return 'Type de fichier non supporté';
    }
    return null;
};

// Get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
            resolve({ width: 0, height: 0 });
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);
    });
};

// Get video metadata
const getVideoMetadata = (file: File): Promise<{ width: number; height: number; duration: number }> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
                duration: video.duration,
            });
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            resolve({ width: 0, height: 0, duration: 0 });
            URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(file);
    });
};

// Extract metadata using exifr
const extractMetadata = async (file: File): Promise<ExtractedMetadata> => {
    const metadata: ExtractedMetadata = {
        takenAt: null,
        lat: null,
        lng: null,
        width: null,
        height: null,
        camera: null,
        exifData: null,
    };

    try {
        if (isImageFile(file)) {
            // Parse EXIF data with exifr
            const exif = await exifr.parse(file, {
                gps: true,
                exif: true,
                // ifd0: true,
            });

            if (exif) {
                // Date
                if (exif.DateTimeOriginal) {
                    metadata.takenAt = new Date(exif.DateTimeOriginal);
                } else if (exif.CreateDate) {
                    metadata.takenAt = new Date(exif.CreateDate);
                }

                // GPS - exifr converts to decimal degrees automatically
                if (exif.latitude !== undefined && exif.longitude !== undefined) {
                    metadata.lat = exif.latitude;
                    metadata.lng = exif.longitude;
                }

                // Dimensions
                metadata.width = exif.ExifImageWidth || exif.ImageWidth || null;
                metadata.height = exif.ExifImageHeight || exif.ImageHeight || null;

                // Camera
                if (exif.Make || exif.Model) {
                    metadata.camera = [exif.Make, exif.Model].filter(Boolean).join(' ');
                }

                // Store full EXIF data
                metadata.exifData = {
                    date_time_original: metadata.takenAt?.toISOString(),
                    gps_latitude: metadata.lat ?? undefined,
                    gps_longitude: metadata.lng ?? undefined,
                    gps_altitude: exif.GPSAltitude,
                    make: exif.Make,
                    model: exif.Model,
                    lens_model: exif.LensModel,
                    focal_length: exif.FocalLength,
                    aperture: exif.FNumber,
                    shutter_speed: exif.ExposureTime ? `1/${Math.round(1 / exif.ExposureTime)}` : undefined,
                    iso: exif.ISO,
                    flash: exif.Flash !== undefined ? Boolean(exif.Flash) : undefined,
                    orientation: exif.Orientation,
                    width: metadata.width ?? undefined,
                    height: metadata.height ?? undefined,
                };
            }

            // If no dimensions from EXIF, get from image element
            if (!metadata.width || !metadata.height) {
                const dimensions = await getImageDimensions(file);
                metadata.width = dimensions.width;
                metadata.height = dimensions.height;
            }
        } else if (isVideoFile(file)) {
            // Get video dimensions
            const videoMeta = await getVideoMetadata(file);
            metadata.width = videoMeta.width;
            metadata.height = videoMeta.height;

            // Use file modification date as fallback
            if (file.lastModified) {
                metadata.takenAt = new Date(file.lastModified);
            }
        }
    } catch (error) {
        console.warn('Error extracting metadata:', error);
    }

    return metadata;
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export default function MediaUploadZone({
    files,
    onFilesChange,
    onMetadataExtracted,
    disabled = false,
    maxFiles = 20,
}: MediaUploadZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [extracting, setExtracting] = useState(false);

    const acceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',');

    const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
        if (!selectedFiles || disabled) return;

        const remainingSlots = maxFiles - files.length;
        const filesToAdd = Array.from(selectedFiles).slice(0, remainingSlots);

        if (filesToAdd.length === 0) return;

        setExtracting(true);

        // Process files and extract metadata
        const newFiles: PendingMedia[] = await Promise.all(
            filesToAdd.map(async (file) => {
                const error = validateFile(file);
                const type: 'photo' | 'video' = isImageFile(file) ? 'photo' : 'video';
                const preview = URL.createObjectURL(file);

                // Extract metadata
                let metadata: ExtractedMetadata | null = null;
                if (!error) {
                    metadata = await extractMetadata(file);
                }

                return {
                    id: generateId(),
                    file,
                    preview,
                    type,
                    status: error ? 'error' : 'pending',
                    progress: 0,
                    error: error || undefined,
                    metadata,
                } as PendingMedia;
            })
        );

        setExtracting(false);

        // Update files
        onFilesChange([...files, ...newFiles]);

        // Call metadata callback with the first file that has useful metadata
        if (onMetadataExtracted) {
            const fileWithGps = newFiles.find((f) => f.metadata?.lat && f.metadata?.lng);
            const fileWithDate = newFiles.find((f) => f.metadata?.takenAt);

            // Prefer file with GPS, fallback to file with date
            const bestFile = fileWithGps || fileWithDate;
            if (bestFile?.metadata) {
                onMetadataExtracted(bestFile.metadata);
            }
        }
    }, [files, onFilesChange, onMetadataExtracted, disabled, maxFiles]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleRemove = (id: string) => {
        const fileToRemove = files.find((f) => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
            onFilesChange(files.filter((f) => f.id !== id));
        }
    };

    const completedCount = files.filter((f) => f.status === 'completed').length;
    const errorCount = files.filter((f) => f.status === 'error').length;
    const uploadingCount = files.filter((f) => f.status === 'uploading').length;
    const filesWithGps = files.filter((f) => f.metadata?.lat && f.metadata?.lng).length;
    const filesWithDate = files.filter((f) => f.metadata?.takenAt).length;

    return (
        <Box>
            <input
                type="file"
                accept={acceptedTypes}
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                ref={fileInputRef}
                style={{ display: 'none' }}
                disabled={disabled || extracting}
            />

            {/* Dropzone */}
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && !extracting && fileInputRef.current?.click()}
                sx={{
                    p: 3,
                    border: '2px dashed',
                    borderColor: dragOver ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: disabled || extracting ? 'not-allowed' : 'pointer',
                    bgcolor: dragOver ? 'primary.50' : 'grey.50',
                    opacity: disabled ? 0.6 : 1,
                    transition: 'all 0.2s',
                    '&:hover': disabled || extracting ? {} : {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                    },
                }}
            >
                <UploadIcon sx={{ fontSize: 40, color: dragOver ? 'primary.main' : 'grey.400', mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {extracting ? 'Extraction des métadonnées...' : 'Glissez vos photos/vidéos ici ou cliquez'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Photos (max {formatFileSize(MAX_FILE_SIZE.IMAGE)}) • Vidéos (max {formatFileSize(MAX_FILE_SIZE.VIDEO)})
                </Typography>
                {files.length > 0 && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {files.length}/{maxFiles} fichiers
                    </Typography>
                )}
            </Box>

            {/* Metadata info chips */}
            {files.length > 0 && (filesWithGps > 0 || filesWithDate > 0) && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {filesWithDate > 0 && (
                        <Chip
                            icon={<CalendarIcon />}
                            label={`${filesWithDate} avec date`}
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    )}
                    {filesWithGps > 0 && (
                        <Chip
                            icon={<LocationIcon />}
                            label={`${filesWithGps} avec GPS`}
                            size="small"
                            color="success"
                            variant="outlined"
                        />
                    )}
                </Box>
            )}

            {/* Preview Grid */}
            {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2">
                            Médias ({files.length})
                        </Typography>
                        {uploadingCount > 0 && (
                            <Chip label="Upload en cours..." size="small" color="primary" />
                        )}
                        {completedCount > 0 && (
                            <Chip label={`${completedCount} uploadé(s)`} size="small" color="success" />
                        )}
                        {errorCount > 0 && (
                            <Chip label={`${errorCount} erreur(s)`} size="small" color="error" />
                        )}
                    </Box>

                    <ImageList cols={4} gap={8} sx={{ mt: 1 }}>
                        {files.map((media) => (
                            <ImageListItem
                                key={media.id}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    border: 1,
                                    borderColor: media.status === 'error' ? 'error.main' : 'divider',
                                }}
                            >
                                {/* Preview */}
                                {media.type === 'photo' ? (
                                    <img
                                        src={media.preview}
                                        alt={media.file.name}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: 100,
                                            objectFit: 'cover',
                                            opacity: media.status === 'error' ? 0.5 : 1,
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 100,
                                            bgcolor: 'grey.900',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: media.status === 'error' ? 0.5 : 1,
                                        }}
                                    >
                                        <PlayIcon sx={{ fontSize: 40, color: 'white' }} />
                                    </Box>
                                )}

                                {/* Upload progress overlay */}
                                {media.status === 'uploading' && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            p: 0.5,
                                        }}
                                    >
                                        <LinearProgress variant="determinate" value={media.progress} />
                                    </Box>
                                )}

                                {/* Status icons */}
                                {media.status === 'completed' && (
                                    <SuccessIcon
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            left: 4,
                                            color: 'success.main',
                                            bgcolor: 'white',
                                            borderRadius: '50%',
                                            fontSize: 20,
                                        }}
                                    />
                                )}

                                {media.status === 'error' && (
                                    <Tooltip title={media.error || 'Erreur'}>
                                        <ErrorIcon
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                left: 4,
                                                color: 'error.main',
                                                bgcolor: 'white',
                                                borderRadius: '50%',
                                                fontSize: 20,
                                            }}
                                        />
                                    </Tooltip>
                                )}

                                {/* Metadata badges */}
                                <Box sx={{ position: 'absolute', bottom: 4, left: 4, display: 'flex', gap: 0.5 }}>
                                    {media.metadata?.lat && media.metadata?.lng && (
                                        <Tooltip title={`${media.metadata.lat.toFixed(4)}, ${media.metadata.lng.toFixed(4)}`}>
                                            <LocationIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: 'white',
                                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                    {media.metadata?.takenAt && (
                                        <Tooltip title={media.metadata.takenAt.toLocaleString()}>
                                            <CalendarIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: 'white',
                                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </Box>

                                {/* Delete button */}
                                {media.status !== 'uploading' && !disabled && (
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(media.id);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 2,
                                            right: 2,
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            '&:hover': { bgcolor: 'error.light', color: 'white' },
                                            width: 24,
                                            height: 24,
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>

                    {/* Error details */}
                    {errorCount > 0 && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {files
                                .filter((f) => f.status === 'error')
                                .map((f) => `${f.file.name}: ${f.error}`)
                                .join(' • ')}
                        </Alert>
                    )}
                </Box>
            )}
        </Box>
    );
}
