'use client';

import { useState } from 'react';
import {
    Box,
    Grid,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
    Dialog,
    DialogContent,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Photo as PhotoIcon,
    Videocam as VideoIcon,
    ViewModule as GalleryIcon,
    Map as MapIcon,
    Close as CloseIcon,
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon,
} from '@mui/icons-material';
import MediaCard from './MediaCard';
import MediaUpload from './MediaUpload';
import EmptyState from '@/components/common/EmptyState';
import type { MediaAsset } from '@/types';

interface MediaGalleryProps {
    media: MediaAsset[];
    tripId?: string;
    journalEntryId?: string;
}

type ViewMode = 'gallery' | 'map';
type FilterType = 'all' | 'photo' | 'video';

export default function MediaGallery({
    media,
    tripId,
    journalEntryId,
}: MediaGalleryProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('gallery');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [uploadOpen, setUploadOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter media
    const filteredMedia = media.filter((m) => {
        if (filterType === 'all') return true;
        return m.media_type === filterType;
    });

    const photos = media.filter((m) => m.media_type === 'photo');
    const videos = media.filter((m) => m.media_type === 'video');

    const handleMediaClick = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev > 0 ? prev - 1 : filteredMedia.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev < filteredMedia.length - 1 ? prev + 1 : 0
        );
    };

    if (media.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<PhotoIcon sx={{ fontSize: 64 }} />}
                    title="Aucun média"
                    description="Ajoutez des photos et vidéos pour immortaliser vos souvenirs."
                    actionLabel="Ajouter des médias"
                    onAction={() => setUploadOpen(true)}
                />

                <MediaUpload
                    open={uploadOpen}
                    onClose={() => setUploadOpen(false)}
                    tripId={tripId || ''}
                    journalEntryId={journalEntryId}
                />
            </>
        );
    }

    return (
        <>
            {/* Toolbar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {/* Stats & filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <ToggleButtonGroup
                        value={filterType}
                        exclusive
                        onChange={(_, v) => v && setFilterType(v)}
                        size="small"
                    >
                        <ToggleButton value="all">
                            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Tous </Box>({media.length})
                        </ToggleButton>
                        <ToggleButton value="photo">
                            <PhotoIcon sx={{ mr: { xs: 0, sm: 0.5 } }} fontSize="small" />
                            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}> </Box>
                            {photos.length}
                        </ToggleButton>
                        <ToggleButton value="video">
                            <VideoIcon sx={{ mr: { xs: 0, sm: 0.5 } }} fontSize="small" />
                            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}> </Box>
                            {videos.length}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* View mode & actions */}
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, v) => v && setViewMode(v)}
                        size="small"
                    >
                        <ToggleButton value="gallery">
                            <GalleryIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="map">
                            <MapIcon fontSize="small" />
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
                        onClick={() => setUploadOpen(true)}
                        sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            Ajouter
                        </Box>
                        <AddIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
                    </Button>
                </Box> */}
            </Box>

            {/* Gallery view */}
            {viewMode === 'gallery' && (
                <Grid container spacing={2}>
                    {filteredMedia.map((item, index) => (
                        <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
                            <MediaCard
                                media={item}
                                onClick={() => handleMediaClick(index)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Map view placeholder */}
            {viewMode === 'map' && (
                <Box
                    sx={{
                        height: 500,
                        bgcolor: 'grey.100',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography color="text.secondary">
                        Carte des médias (à implémenter avec Leaflet)
                    </Typography>
                </Box>
            )}

            {/* Lightbox */}
            <Dialog
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: 'black', m: 1 },
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {/* Close button */}
                    <IconButton
                        onClick={() => setLightboxOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            zIndex: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Navigation */}
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            zIndex: 10,
                        }}
                    >
                        <PrevIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            zIndex: 10,
                        }}
                    >
                        <NextIcon />
                    </IconButton>

                    {/* Media display */}
                    {filteredMedia[currentIndex] && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '80vh',
                            }}
                        >
                            {filteredMedia[currentIndex].media_type === 'photo' ? (
                                <Box
                                    component="img"
                                    src={filteredMedia[currentIndex].url}
                                    alt={filteredMedia[currentIndex].caption || 'Photo'}
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '80vh',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Box
                                    component="video"
                                    src={filteredMedia[currentIndex].url}
                                    controls
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '80vh',
                                    }}
                                />
                            )}
                        </Box>
                    )}

                    {/* Caption & info */}
                    {filteredMedia[currentIndex]?.caption && (
                        <Box sx={{ p: 2, color: 'white', textAlign: 'center' }}>
                            <Typography variant="body1">
                                {filteredMedia[currentIndex].caption}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Upload dialog */}
            <MediaUpload
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                tripId={tripId || ''}
                journalEntryId={journalEntryId}
            />
        </>
    );
}
