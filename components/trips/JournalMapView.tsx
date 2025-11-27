'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Chip,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    Fab,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    ExpandMore as ExpandIcon,
    Map as MapIcon,
    List as ListIcon,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { formatDateLong } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import type { JournalEntryWithMedia, MediaAsset } from '@/types';

// Import dynamique de la carte
const TripMapView = dynamic(() => import('./TripMapView'), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(26, 26, 26, 0.05)',
                borderRadius: 3,
            }}
        >
            <Typography color="text.secondary">Chargement de la carte...</Typography>
        </Box>
    ),
});

interface JournalMapViewProps {
    entries: JournalEntryWithMedia[];
    media: MediaAsset[];
    tripLat?: number | null;
    tripLng?: number | null;
}

export default function JournalMapView({
    entries,
    media,
    tripLat,
    tripLng,
}: JournalMapViewProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const timelineRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Entries with coordinates sorted by date
    const sortedEntries = [...entries]
        .filter((e) => e.lat && e.lng)
        .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());

    // Handle entry click - center map and highlight
    const handleEntryClick = (entryId: string) => {
        setSelectedEntryId(entryId);
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    // Handle marker click from map - scroll to entry
    const handleMarkerClick = (entryId: string) => {
        setSelectedEntryId(entryId);
        const ref = timelineRefs.current[entryId];
        if (ref) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (isMobile) {
            setMobileDrawerOpen(true);
        }
    };

    // Get selected entry coordinates for map centering
    const selectedEntry = entries.find((e) => e.id === selectedEntryId);

    // Timeline component
    const Timeline = () => (
        <Box
            sx={{
                height: '100%',
                overflowY: 'auto',
                px: { xs: 2, md: 2 },
                py: 2,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(26, 26, 26, 0.2)',
                    borderRadius: 3,
                },
            }}
        >
            {sortedEntries.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <LocationIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                    <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                        Aucune entrée avec coordonnées
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ajoutez des photos avec GPS ou renseignez manuellement les lieux.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: 24,
                            bottom: 24,
                            width: 3,
                            bgcolor: 'rgba(26, 26, 26, 0.1)',
                            borderRadius: 2,
                        }}
                    />

                    {/* Entries */}
                    {sortedEntries.map((entry, index) => {
                        const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
                        const isSelected = selectedEntryId === entry.id;
                        const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];

                        return (
                            <Box
                                key={entry.id}
                                ref={(el: HTMLDivElement | null) => {
                                    timelineRefs.current[entry.id] = el;
                                }}
                                sx={{
                                    position: 'relative',
                                    pl: 5,
                                    pb: 3,
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleEntryClick(entry.id)}
                            >
                                {/* Timeline dot */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 8,
                                        top: 8,
                                        width: isSelected ? 20 : 16,
                                        height: isSelected ? 20 : 16,
                                        borderRadius: '50%',
                                        bgcolor: moodData?.color || '#1A1A1A',
                                        border: isSelected ? '3px solid #F5B82E' : '3px solid #FFFDF5',
                                        boxShadow: isSelected ? '0 0 0 3px rgba(245, 184, 46, 0.3)' : 'none',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'white' }}>
                                        {index + 1}
                                    </Typography>
                                </Box>

                                {/* Entry card */}
                                <Card
                                    sx={{
                                        p: 2,
                                        transition: 'all 0.2s ease',
                                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: isSelected ? 4 : 1,
                                        border: isSelected ? '2px solid #F5B82E' : '2px solid transparent',
                                        '&:hover': {
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    {/* Date & Mood */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                            {formatDateLong(entry.entry_date)}
                                        </Typography>
                                        {moodData && (
                                            <Typography sx={{ fontSize: 18 }}>{moodData.emoji}</Typography>
                                        )}
                                    </Box>

                                    {/* Location */}
                                    {entry.location && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {entry.location}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Content preview */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {entry.content}
                                    </Typography>

                                    {/* Photo thumbnails */}
                                    {photos.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
                                            {photos.slice(0, 3).map((photo) => (
                                                <Box
                                                    key={photo.id}
                                                    component="img"
                                                    src={photo.thumbnail_url || photo.url}
                                                    alt=""
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            ))}
                                            {photos.length > 3 && (
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 1,
                                                        bgcolor: '#1A1A1A',
                                                        color: '#F5B82E',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                        +{photos.length - 3}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Card>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );

    // Mobile view with toggle
    if (isMobile) {
        return (
            <Box sx={{ height: 'calc(100vh - 200px)', position: 'relative' }}>
                {/* Map fullscreen */}
                <Box sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                    <TripMapView
                        entries={sortedEntries}
                        media={media}
                        tripLat={tripLat}
                        tripLng={tripLng}
                        selectedEntryId={selectedEntryId}
                        onMarkerClick={handleMarkerClick}
                        centerOnEntry={selectedEntry}
                    />
                </Box>

                {/* Toggle FAB */}
                <Fab
                    onClick={() => setMobileDrawerOpen(true)}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        bgcolor: '#1A1A1A',
                        color: '#F5B82E',
                        '&:hover': { bgcolor: '#2D2620' },
                    }}
                >
                    <ListIcon />
                </Fab>

                {/* Entry count badge */}
                <Chip
                    label={`${sortedEntries.length} étape${sortedEntries.length > 1 ? 's' : ''}`}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: '#1A1A1A',
                        color: '#F5B82E',
                        fontWeight: 700,
                    }}
                />

                {/* Bottom drawer for timeline */}
                <Drawer
                    anchor="bottom"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    PaperProps={{
                        sx: {
                            height: '70vh',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            bgcolor: 'background.default',
                        },
                    }}
                >
                    {/* Handle */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(26, 26, 26, 0.2)',
                            }}
                        />
                    </Box>

                    {/* Header */}
                    <Box sx={{ px: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Itinéraire
                        </Typography>
                        <IconButton onClick={() => setMobileDrawerOpen(false)}>
                            <ExpandIcon />
                        </IconButton>
                    </Box>

                    <Timeline />
                </Drawer>
            </Box>
        );
    }

    // Desktop view with split layout
    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100vh - 250px)',
                minHeight: 500,
                gap: 2,
            }}
        >
            {/* Timeline - 1/3 */}
            <Box
                sx={{
                    width: '33%',
                    minWidth: 300,
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ p: 2, borderBottom: '2px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Itinéraire
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {sortedEntries.length} étape{sortedEntries.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Timeline />
            </Box>

            {/* Map - 2/3 */}
            <Box
                sx={{
                    flex: 1,
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                <TripMapView
                    entries={sortedEntries}
                    media={media}
                    tripLat={tripLat}
                    tripLng={tripLng}
                    selectedEntryId={selectedEntryId}
                    onMarkerClick={handleMarkerClick}
                    centerOnEntry={selectedEntry}
                />
            </Box>
        </Box>
    );
}
