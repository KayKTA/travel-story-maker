'use client';

import { useMemo } from 'react';
import { Box, Card, Typography, Fab, IconButton } from '@mui/material';
import { List as ListIcon, Close as CloseIcon } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useBreakpoint, useDisclosure, useSelection, useElementRefs } from '@/lib/hooks';
import { tokens, scrollable } from '@/styles';
import { CountBadge } from '@/components/common';
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
                bgcolor: 'action.hover',
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
    const timelinePanel = useDisclosure(true); // Desktop timeline panel open by default
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

    // Handle entry click - center map and close drawer on mobile
    const handleEntryClick = (entryId: string) => {
        select(entryId);
        if (isMediumDown) {
            drawer.onClose();
        }
    };

    // Handle marker click from map - scroll to entry in timeline
    const handleMarkerClick = (entryId: string) => {
        select(entryId);
        // Scroll to the entry card in the timeline
        setTimeout(() => scrollTo(entryId), 100);
        if (isMediumDown) {
            drawer.onOpen();
        } else if (!timelinePanel.isOpen) {
            timelinePanel.onOpen();
        }
    };

    // Mobile view
    if (isMediumDown) {
        return (
            <Card
                sx={{
                    height: 'calc(100vh - 200px)',
                    minHeight: 400,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Map fullscreen */}
                <Box sx={{ height: '100%' }}>
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
                        '&:hover': { bgcolor: 'background.paper' },
                    }}
                >
                    <ListIcon />
                </Fab>

                {/* Entry count badge */}
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <CountBadge
                        count={sortedEntries.length}
                        singular="étape"
                        plural="étapes"
                        variant="primary"
                    />
                </Box>

                {/* Bottom drawer for timeline */}
                <TimelineDrawer
                    open={drawer.isOpen}
                    onClose={drawer.onClose}
                    entries={sortedEntries}
                    selectedId={selectedEntryId}
                    onSelect={handleEntryClick}
                    setRef={setRef}
                />
            </Card>
        );
    }

    // Desktop view - Map with overlaid timeline card
    return (
        <Card
            sx={{
                height: 'calc(100vh - 250px)',
                minHeight: 500,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Map takes full space */}
            <Box sx={{ height: '100%' }}>
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

            {/* Entry count badge */}
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
                <CountBadge
                    count={sortedEntries.length}
                    singular="étape"
                    plural="étapes"
                    variant="primary"
                />
            </Box>

            {/* Timeline panel - overlaid card */}
            {timelinePanel.isOpen ? (
                <Card
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bottom: 16,
                        width: 360,
                        maxWidth: 'calc(100% - 32px)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 5,
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                Itinéraire
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {sortedEntries.length} étape{sortedEntries.length > 1 ? 's' : ''}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={timelinePanel.onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Timeline content */}
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Timeline
                            entries={sortedEntries}
                            selectedId={selectedEntryId}
                            onSelect={handleEntryClick}
                            setRef={setRef}
                        />
                    </Box>
                </Card>
            ) : (
                /* Toggle button when panel is closed */
                <Fab
                    size="medium"
                    onClick={timelinePanel.onOpen}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 5,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        '&:hover': { bgcolor: 'background.paper' },
                    }}
                >
                    <ListIcon />
                </Fab>
            )}
        </Card>
    );
}
