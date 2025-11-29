'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Skeleton,
    IconButton,
    Tabs,
    Tab,
    Chip,
    Stack,
    Grid,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    CalendarToday as CalendarIcon,
    PhotoCamera as PhotoIcon,
    Videocam as VideoIcon,
    Book as JournalIcon,
    Receipt as ExpenseIcon,
    Map as MapIcon,
    Dashboard as OverviewIcon,
    AutoStories as StoriesIcon,
    Collections as MediaIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTripData, useMultiDisclosure, useBreakpoint } from '@/lib/hooks';
import { tokens, flexBetween } from '@/styles';
import { ActionSpeedDial, type SpeedDialActionItem } from '@/components/common';
import { formatDateRange } from '@/lib/utils/formatters';
import JournalForm from '@/components/journal/JournalForm';
import ExpenseForm from '@/components/expenses/ExpenseForm';

// Tab panels
import JournalMapView from './JournalMapView';
import { ExpenseDashboard } from '@/components/expenses';
import MediaGallery from '@/components/media/MediaGallery';
// import CoverImageUpload from './CoverImageUpload';

interface TripDetailClientProps {
    tripId: string;
}

// Tab configuration
const TABS = [
    // { id: 'overview', label: 'Aperçu', icon: <OverviewIcon fontSize="small" /> },
    { id: 'itinerary', label: 'Itinéraire', icon: <MapIcon fontSize="small" /> },
    { id: 'media', label: 'Médias', icon: <MediaIcon fontSize="small" /> },
    { id: 'expenses', label: 'Dépenses', icon: <ExpenseIcon fontSize="small" /> },
    // { id: 'stories', label: 'Stories', icon: <StoriesIcon fontSize="small" /> },
];

// Loading skeleton
function TripDetailSkeleton() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ bgcolor: 'primary.main', pt: 3, pb: 0 }}>
                <Container maxWidth="xl">
                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />
                    <Skeleton variant="text" width={250} height={48} sx={{ mt: 2, bgcolor: 'rgba(0,0,0,0.1)' }} />
                    {/* <Skeleton variant="text" width={150} height={28} sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} /> */}
                    <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2 }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" width={100} height={40} sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />
                        ))}
                    </Stack>
                </Container>
            </Box>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Skeleton variant="rounded" height={600} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Skeleton variant="rounded" height={600} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

// Error state
function TripNotFound() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Voyage non trouvé</Typography>
            <Chip
                component={Link}
                href="/trips"
                icon={<BackIcon />}
                label="Retour aux voyages"
                clickable
            />
        </Box>
    );
}

export default function TripDetailClient({ tripId }: TripDetailClientProps) {
    const [activeTab, setActiveTab] = useState('itinerary');
    const { isMobile } = useBreakpoint();

    // Data fetching
    const { trip, entries, media, expenses, stories, stats, loading, error, refresh, tripName } =
        useTripData(tripId);

    // Modals state
    const modals = useMultiDisclosure(['journal', 'expense']);

    // Speed dial actions (mobile)
    const speedDialActions: SpeedDialActionItem[] = [
        { icon: <JournalIcon />, name: 'Nouvelle étape', onClick: () => modals.open('journal') },
        { icon: <ExpenseIcon />, name: 'Dépense', onClick: () => modals.open('expense') },
    ];

    // Handlers
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handleJournalSubmit = async () => {
        await refresh();
    };

    const handleExpenseSubmit = async () => {
        await refresh();
    };

    if (loading) return <TripDetailSkeleton />;
    if (error || !trip) return <TripNotFound />;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* ============================================================ */}
            {/* HEADER - Full width background with optional cover image */}
            {/* ============================================================ */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'background.default',
                    position: 'sticky',
                    top: 0,
                    zIndex: tokens.zIndex.header,
                    backgroundImage: trip.cover_image_url
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${trip.cover_image_url})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container maxWidth="xl">
                    {/* Top row: Back button + Actions */}
                    <Box sx={{ ...flexBetween, pt: { xs: 2, sm: 3 }, pb: 2 }}>
                        <IconButton
                            component={Link}
                            href="/trips"
                            size="small"
                            sx={{
                                color: 'background.default',
                                bgcolor: 'rgba(0,0,0,0.2)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' },
                            }}
                        >
                            <BackIcon />
                        </IconButton>

                        {/* Desktop actions */}
                        <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            {/* <CoverImageUpload
                                tripId={tripId}
                                currentImageUrl={trip.cover_image_url}
                                onUploadComplete={refresh}
                                onRemove={refresh}
                            /> */}
                            <Chip
                                icon={<JournalIcon sx={{ color: 'inherit !important' }} />}
                                label="Nouvelle étape"
                                onClick={() => modals.open('journal')}
                                sx={{
                                    bgcolor: 'background.default',
                                    color: 'primary.main',
                                    fontWeight: tokens.fontWeights.medium,
                                    '&:hover': { bgcolor: 'background.paper' },
                                }}
                            />
                            <Chip
                                icon={<ExpenseIcon sx={{ color: 'inherit !important' }} />}
                                label="Dépense"
                                onClick={() => modals.open('expense')}
                                variant="outlined"
                                sx={{
                                    borderColor: 'background.default',
                                    color: 'background.default',
                                    fontWeight: tokens.fontWeights.medium,
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' },
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Title + Stats row */}
                    <Box sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
                            {/* Title section */}
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography
                                    variant={isMobile ? 'h4' : 'h3'}
                                    sx={{ fontWeight: tokens.fontWeights.bold, lineHeight: 1.2 }}
                                >
                                    {trip.country}
                                </Typography>
                                {trip.city && (
                                    <Typography
                                        variant={isMobile ? 'body1' : 'h6'}
                                        sx={{ opacity: 0.8, fontWeight: tokens.fontWeights.regular, mt: 0.5 }}
                                    >
                                        {trip.city}
                                    </Typography>
                                )}
                            </Box>

                            {/* Stats chips - desktop */}
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                }}
                            >
                                <Chip
                                    icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                                    label={formatDateRange(trip.start_date, trip.end_date)}
                                    size="small"
                                    sx={{
                                        bgcolor: trip.cover_image_url ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)',
                                        backdropFilter: trip.cover_image_url ? 'blur(4px)' : undefined,
                                        color: 'background.default',
                                        fontWeight: tokens.fontWeights.medium,
                                        '& .MuiChip-icon': { color: 'inherit' },
                                    }}
                                />
                                {stats.photosCount > 0 && (
                                    <Chip
                                        icon={<PhotoIcon sx={{ fontSize: 16 }} />}
                                        label={`${stats.photosCount} photos`}
                                        size="small"
                                        sx={{
                                            bgcolor: trip.cover_image_url ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
                                            backdropFilter: trip.cover_image_url ? 'blur(4px)' : undefined,
                                            color: 'background.default',
                                            '& .MuiChip-icon': { color: 'inherit' },
                                        }}
                                    />
                                )}
                                {stats.videosCount > 0 && (
                                    <Chip
                                        icon={<VideoIcon sx={{ fontSize: 16 }} />}
                                        label={`${stats.videosCount} vidéos`}
                                        size="small"
                                        sx={{
                                            bgcolor: trip.cover_image_url ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
                                            backdropFilter: trip.cover_image_url ? 'blur(4px)' : undefined,
                                            color: 'background.default',
                                            '& .MuiChip-icon': { color: 'inherit' },
                                        }}
                                    />
                                )}
                                {stats.totalExpenses > 0 && (
                                    <Chip
                                        icon={<ExpenseIcon sx={{ fontSize: 16 }} />}
                                        label={`${stats.totalExpenses.toFixed(0)}€`}
                                        size="small"
                                        sx={{
                                            bgcolor: trip.cover_image_url ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
                                            backdropFilter: trip.cover_image_url ? 'blur(4px)' : undefined,
                                            color: 'background.default',
                                            '& .MuiChip-icon': { color: 'inherit' },
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        {/* Stats chips - mobile (under title) */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                mt: 2,
                                flexWrap: 'wrap',
                                gap: 1,
                            }}
                        >
                            <Chip
                                icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                                label={formatDateRange(trip.start_date, trip.end_date)}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    color: 'background.default',
                                    fontSize: '0.75rem',
                                    '& .MuiChip-icon': { color: 'inherit' },
                                }}
                            />
                            {stats.photosCount > 0 && (
                                <Chip
                                    icon={<PhotoIcon sx={{ fontSize: 14 }} />}
                                    label={stats.photosCount}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        color: 'background.default',
                                        '& .MuiChip-icon': { color: 'inherit' },
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {/* Tabs - integrated in header */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant={isMobile ? 'scrollable' : 'standard'}
                        scrollButtons="auto"
                        sx={{
                            minHeight: 48,
                            '& .MuiTabs-indicator': {
                                bgcolor: 'background.default',
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                            '& .MuiTab-root': {
                                color: 'background.default',
                                fontWeight: tokens.fontWeights.medium,
                                minHeight: 48,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                '&.Mui-selected': {
                                    color: 'background.default',
                                },
                            },
                        }}
                    >
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.id}
                                value={tab.id}
                                label={isMobile ? undefined : tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                                sx={{
                                    minWidth: isMobile ? 'auto' : 120,
                                    px: isMobile ? 2 : 3,
                                }}
                            />
                        ))}
                    </Tabs>
                </Container>
            </Box>

            {/* ============================================================ */}
            {/* CONTENT */}
            {/* ============================================================ */}
            <Container maxWidth="xl" sx={{ py: 3, pb: { xs: 12, sm: 4 } }}>
                {/* Overview Tab */}
                {/* {activeTab === 'overview' && (
                    <TripOverviewDashboard
                        trip={trip}
                        entries={entries}
                        media={media}
                        expenses={expenses}
                        stats={stats}
                        onOpenJournal={() => modals.open('journal')}
                        onOpenExpense={() => modals.open('expense')}
                        onNavigateToTab={setActiveTab}
                    />
                )} */}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                    <JournalMapView
                        entries={entries}
                        media={media}
                        tripLat={trip.lat}
                        tripLng={trip.lng}
                    />
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <MediaGallery
                        media={media}
                        tripId={tripId}
                    />
                )}

                {/* Expenses Tab */}
                {activeTab === 'expenses' && (
                    <ExpenseDashboard
                        expenses={expenses}
                        tripId={tripId}
                        onRefresh={refresh}
                        onAddExpense={() => modals.open('expense')}
                    />
                )}

            </Container>

            {/* ============================================================ */}
            {/* FORMS */}
            {/* ============================================================ */}
            <JournalForm
                open={modals.isOpen('journal')}
                onClose={() => modals.close('journal')}
                onSubmit={handleJournalSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            <ExpenseForm
                open={modals.isOpen('expense')}
                onClose={() => modals.close('expense')}
                onSubmit={handleExpenseSubmit}
                tripId={tripId}
                tripName={tripName}
            />

            {/* Mobile Speed Dial */}
            <ActionSpeedDial actions={speedDialActions} />
        </Box>
    );
}
