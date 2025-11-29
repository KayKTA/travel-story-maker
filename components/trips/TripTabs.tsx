'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Explore as ExploreIcon,
    Photo as PhotoIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import JournalMapView from './JournalMapView';
import MediaGallery from '@/components/media/MediaGallery';
import ExpenseList from '@/components/expenses/ExpenseList';
import { formatCurrency, getDurationDays } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import { useBreakpoint } from '@/lib/hooks';
import { tokens } from '@/styles';
import OverviewStatCard from './OverviewStatCard';
import type {
    Trip,
    JournalEntryWithMedia,
    MediaAsset,
    Expense,
    Story,
} from '@/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`trip-tabpanel-${index}`}
            aria-labelledby={`trip-tab-${index}`}
        >
            {value === index && <Box sx={{ py: { xs: 2, sm: 3 } }}>{children}</Box>}
        </Box>
    );
}

interface TripTabsProps {
    trip: Trip;
    journalEntries: JournalEntryWithMedia[];
    media: MediaAsset[];
    expenses: Expense[];
    stories: Story[];
    stats: {
        journalCount: number;
        photosCount: number;
        videosCount: number;
        totalExpenses: number;
        storiesCount: number;
    };
    onRefresh?: () => void;
}

export default function TripTabs({
    trip,
    journalEntries,
    media,
    expenses,
    stories,
    stats,
    onRefresh,
}: TripTabsProps) {
    const { isMobile } = useBreakpoint();
    const [currentTab, setCurrentTab] = useState(0);

    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);
    const durationDays = getDurationDays(trip.start_date, trip.end_date);
    const entriesWithGps = useMemo(
        () => journalEntries.filter((e) => e.lat && e.lng).length,
        [journalEntries]
    );

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    // Simplified tabs: Overview, Itinéraire (Journal+Map merged), Médias, Dépenses
    const tabs = [
        { icon: <DashboardIcon />, label: 'Aperçu', count: null },
        { icon: <ExploreIcon />, label: 'Itinéraire', count: stats.journalCount },
        { icon: <PhotoIcon />, label: 'Médias', count: stats.photosCount + stats.videosCount },
        { icon: <ReceiptIcon />, label: 'Dépenses', count: expenses.length },
    ];

    return (
        <Box>
            {/* Tabs Navigation */}
            <Box
                sx={{
                    borderBottom: 2,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    position: 'sticky',
                    top: { xs: 100, sm: 80 },
                    zIndex: 5,
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{
                        minHeight: { xs: 52, sm: 56 },
                        '& .MuiTab-root': {
                            minHeight: { xs: 52, sm: 56 },
                            minWidth: { xs: 'auto', sm: 140 },
                            px: { xs: 2, sm: 3 },
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            fontWeight: 700,
                        },
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            icon={
                                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    {tab.icon}
                                    {tab.count !== null && tab.count > 0 && isMobile && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -6,
                                                right: -10,
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                fontSize: 10,
                                                fontWeight: tokens.fontWeights.bold,
                                                borderRadius: tokens.radius.circle,
                                                width: 18,
                                                height: 18,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {tab.count > 99 ? '99+' : tab.count}
                                        </Box>
                                    )}
                                </Box>
                            }
                            iconPosition="start"
                            label={
                                isMobile
                                    ? undefined
                                    : `${tab.label}${tab.count !== null ? ` (${tab.count})` : ''}`
                            }
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Overview Tab */}
                <TabPanel value={currentTab} index={0}>
                    {/* Quick Stats Grid */}
                    <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <OverviewStatCard
                                value={durationDays}
                                label="jours"
                                color="default"
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <OverviewStatCard
                                value={stats.journalCount}
                                label="étapes"
                                color="primary"
                                onClick={() => setCurrentTab(1)}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <OverviewStatCard
                                value={stats.photosCount + stats.videosCount}
                                label="médias"
                                color="secondary"
                                onClick={() => setCurrentTab(2)}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <OverviewStatCard
                                value={formatCurrency(stats.totalExpenses)}
                                label="dépensés"
                                color="error"
                                onClick={() => setCurrentTab(3)}
                            />
                        </Grid>
                    </Grid>

                    {/* Trip Info Card */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Stack spacing={2}>
                                {/* Mood */}
                                {moodData && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={`${moodData.emoji} ${moodData.label}`}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                fontWeight: tokens.fontWeights.bold,
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Description */}
                                {trip.description && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                            À propos
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {trip.description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* GPS info */}
                                {entriesWithGps > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            p: 1.5,
                                            borderRadius: tokens.radius.md,
                                            bgcolor: 'action.hover',
                                            border: 2,
                                            borderStyle: 'dashed',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                bgcolor: 'action.selected',
                                            },
                                        }}
                                        onClick={() => setCurrentTab(1)}
                                    >
                                        <ExploreIcon sx={{ color: 'primary.main' }} />
                                        <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.semibold }}>
                                            {entriesWithGps} étape{entriesWithGps > 1 ? 's' : ''} sur la carte
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                            Voir →
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Preview */}
                    {journalEntries.length > 0 && (
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                    Dernières étapes
                                </Typography>
                                <Chip
                                    label="Voir tout"
                                    size="small"
                                    onClick={() => setCurrentTab(1)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        fontWeight: tokens.fontWeights.bold,
                                    }}
                                />
                            </Box>
                            <Stack spacing={1}>
                                {journalEntries.slice(0, 3).map((entry) => (
                                    <Card key={entry.id} variant="outlined" sx={{ borderWidth: 2 }}>
                                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.bold }}>
                                                        {entry.location ||
                                                            new Date(entry.entry_date).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                            })}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {entry.content}
                                                    </Typography>
                                                </Box>
                                                {entry.media_assets && entry.media_assets.length > 0 && (
                                                    <Chip
                                                        icon={<PhotoIcon sx={{ fontSize: 14 }} />}
                                                        label={entry.media_assets.length}
                                                        size="small"
                                                        sx={{
                                                            ml: 1,
                                                            height: 24,
                                                            bgcolor: 'action.hover',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </TabPanel>

                {/* Itinéraire Tab (Journal + Map merged) */}
                <TabPanel value={currentTab} index={1}>
                    <JournalMapView
                        entries={journalEntries}
                        media={media}
                        tripLat={trip.lat}
                        tripLng={trip.lng}
                    />
                </TabPanel>

                {/* Médias Tab */}
                <TabPanel value={currentTab} index={2}>
                    <MediaGallery media={media} tripId={trip.id} />
                </TabPanel>

                {/* Dépenses Tab */}
                <TabPanel value={currentTab} index={3}>
                    <ExpenseList expenses={expenses} tripId={trip.id} onRefresh={onRefresh} />
                </TabPanel>
            </Box>
        </Box>
    );
}
