'use client';

import { useMemo } from 'react';
import { Box, Card, Typography, Fab, IconButton, Chip, Tabs, Tab } from '@mui/material';
import { List as ListIcon, Close as CloseIcon, FilterList as FilterIcon } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useBreakpoint, useDisclosure, useSelection, useElementRefs } from '@/lib/hooks';
import { tokens } from '@/styles';
import { Timeline, TimelineDrawer } from './timeline';
import type { JournalEntryWithMedia, MediaAsset } from '@/types';

// Dynamic map import with loading state
const TripMapView = dynamic(() => import('./TripMapView'), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#F8F9FA',
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
    const { isMediumDown } = useBreakpoint();
    const drawer = useDisclosure();
    const { selected: selectedEntryId, select } = useSelection<string>();
    const { setRef, scrollTo } = useElementRefs<HTMLDivElement>();

    // Entries with coordinates sorted by date
    const sortedEntries = useMemo(
        () =>
            [...entries]
                .filter((e) => e.lat && e.lng)
                .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()),
        [entries]
    );

    // Selected entry for map centering
    const selectedEntry = useMemo(
        () => entries.find((e) => e.id === selectedEntryId) || null,
        [entries, selectedEntryId]
    );

    // Handle entry click - center map
    const handleEntryClick = (entryId: string) => {
        select(entryId);
        if (isMediumDown) {
            drawer.onClose();
        }
    };

    // Handle marker click from map - scroll to entry in timeline
    const handleMarkerClick = (entryId: string) => {
        select(entryId);
        setTimeout(() => scrollTo(entryId), 100);
        if (isMediumDown) {
            drawer.onOpen();
        }
    };

    // Mobile view
    if (isMediumDown) {
        return (
            <Box sx={{ height: 'calc(100vh - 200px)', minHeight: 400, position: 'relative' }}>
                {/* Map fullscreen */}
                <Box sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
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
                    size="medium"
                    onClick={drawer.onOpen}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                        '&:hover': { bgcolor: 'background.paper' },
                    }}
                >
                    <ListIcon />
                </Fab>

                {/* Entry count badge */}
                <Chip
                    label={`${sortedEntries.length} étape${sortedEntries.length > 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: 'background.paper',
                        fontWeight: tokens.fontWeights.semibold,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                />

                {/* Bottom drawer for timeline */}
                <TimelineDrawer
                    open={drawer.isOpen}
                    onClose={drawer.onClose}
                    entries={sortedEntries}
                    selectedId={selectedEntryId}
                    onSelect={handleEntryClick}
                    setRef={setRef}
                />
            </Box>
        );
    }

    // Desktop view - Side by side layout (like package tracking)
    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100vh - 250px)',
                minHeight: 550,
                gap: 0,
                bgcolor: 'background.paper',
                borderRadius: 3,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
            }}
        >
            {/* Left panel - Timeline list */}
            <Box
                sx={{
                    width: 380,
                    minWidth: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: tokens.fontWeights.bold }}>
                            Étapes
                        </Typography>
                        <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
                            <FilterIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Filter tabs */}
                    <Tabs
                        value={0}
                        sx={{
                            minHeight: 36,
                            '& .MuiTabs-indicator': { display: 'none' },
                            '& .MuiTab-root': {
                                minHeight: 36,
                                minWidth: 'auto',
                                px: 2,
                                py: 0.5,
                                mr: 1,
                                borderRadius: 5,
                                textTransform: 'none',
                                fontWeight: tokens.fontWeights.medium,
                                fontSize: '0.85rem',
                                color: 'text.secondary',
                                bgcolor: 'transparent',
                                border: 1,
                                borderColor: 'divider',
                                '&.Mui-selected': {
                                    bgcolor: 'text.primary',
                                    color: 'background.paper',
                                    borderColor: 'text.primary',
                                },
                            },
                        }}
                    >
                        <Tab label={`Toutes (${sortedEntries.length})`} />
                        <Tab label="Favorites" disabled />
                    </Tabs>
                </Box>

                {/* Timeline entries */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Timeline
                        entries={sortedEntries}
                        selectedId={selectedEntryId}
                        onSelect={handleEntryClick}
                        setRef={setRef}
                    />
                </Box>
            </Box>

            {/* Right panel - Map */}
            <Box sx={{ flex: 1, position: 'relative' }}>
                <TripMapView
                    entries={sortedEntries}
                    media={media}
                    tripLat={tripLat}
                    tripLng={tripLng}
                    selectedEntryId={selectedEntryId}
                    onMarkerClick={handleMarkerClick}
                    centerOnEntry={selectedEntry}
                />

                {/* Map location indicator */}
                {selectedEntry && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10,
                        }}
                    >
                        <Chip
                            icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', ml: 1 }} />}
                            label={selectedEntry.location || `Étape ${sortedEntries.findIndex(e => e.id === selectedEntry.id) + 1}`}
                            sx={{
                                bgcolor: 'background.paper',
                                fontWeight: tokens.fontWeights.semibold,
                                fontSize: '1rem',
                                py: 2.5,
                                px: 1,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                '& .MuiChip-label': { px: 1.5 },
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
