'use client';

import { useState } from 'react';
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
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Book as BookIcon,
    Photo as PhotoIcon,
    Receipt as ReceiptIcon,
    AutoAwesome as StoriesIcon,
    Map as MapIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import JournalList from '@/components/journal/JournalList';
import MediaGallery from '@/components/media/MediaGallery';
import ExpenseList from '@/components/expenses/ExpenseList';
import { TripMap } from '@/components/map';
import { formatCurrency, getDurationDays } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import type { Trip, JournalEntryWithMedia, MediaAsset, Expense, Story } from '@/types';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentTab, setCurrentTab] = useState(0);

    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);
    const durationDays = getDurationDays(trip.start_date, trip.end_date);
    const entriesWithGps = journalEntries.filter((e) => e.lat && e.lng).length;
    const mediaWithGps = media.filter((m) => m.lat && m.lng).length;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    // Mobile tab config - icons only with badge
    const tabs = [
        { icon: <DashboardIcon />, label: 'Aperçu', count: null },
        { icon: <BookIcon />, label: 'Journal', count: stats.journalCount },
        { icon: <MapIcon />, label: 'Carte', count: entriesWithGps + mediaWithGps },
        { icon: <PhotoIcon />, label: 'Médias', count: stats.photosCount + stats.videosCount },
        { icon: <ReceiptIcon />, label: 'Dépenses', count: expenses.length },
        // { icon: <StoriesIcon />, label: 'Stories', count: stats.storiesCount },
    ];

    return (
        <Box>
            {/* Tabs Navigation */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    position: 'sticky',
                    top: { xs: 100, sm: 0 },
                    zIndex: 50,
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{
                        minHeight: { xs: 48, sm: 56 },
                        '& .MuiTab-root': {
                            minHeight: { xs: 48, sm: 56 },
                            minWidth: { xs: 'auto', sm: 120 },
                            px: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                                                right: -8,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                borderRadius: '50%',
                                                width: 16,
                                                height: 16,
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
                            label={isMobile ? undefined : `${tab.label}${tab.count !== null ? ` (${tab.count})` : ''}`}
                            sx={{
                                '& .MuiTab-iconWrapper': {
                                    mr: isMobile ? 0 : 1,
                                },
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 'lg', mx: 'auto' }}>
                {/* Overview Tab */}
                <TabPanel value={currentTab} index={0}>
                    {/* Quick Stats Grid */}
                    <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h4'}
                                        sx={{ fontWeight: 700, color: 'primary.main' }}
                                    >
                                        {durationDays}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        jours
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card
                                sx={{ height: '100%', cursor: 'pointer' }}
                                onClick={() => setCurrentTab(1)}
                            >
                                <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h4'}
                                        sx={{ fontWeight: 700, color: 'success.main' }}
                                    >
                                        {stats.journalCount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        entrées
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card
                                sx={{ height: '100%', cursor: 'pointer' }}
                                onClick={() => setCurrentTab(3)}
                            >
                                <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h4'}
                                        sx={{ fontWeight: 700, color: 'info.main' }}
                                    >
                                        {stats.photosCount + stats.videosCount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        médias
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Card
                                sx={{ height: '100%', cursor: 'pointer' }}
                                onClick={() => setCurrentTab(4)}
                            >
                                <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant={isMobile ? 'h5' : 'h4'}
                                        sx={{ fontWeight: 700, color: 'warning.main' }}
                                    >
                                        {formatCurrency(stats.totalExpenses)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        dépensés
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Trip Info Card */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent sx={{ py: { xs: 2, sm: 3 } }}>
                            <Stack spacing={2}>
                                {/* Destination & Mood */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Destination
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {trip.country}{trip.city && `, ${trip.city}`}
                                        </Typography>
                                    </Box>
                                    {moodData && (
                                        <Chip
                                            label={`${moodData.emoji} ${moodData.label}`}
                                            size="small"
                                            sx={{ bgcolor: 'grey.100' }}
                                        />
                                    )}
                                </Box>

                                {/* Description */}
                                {trip.description && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            À propos
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {trip.description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* GPS if available */}
                                {trip.lat && trip.lng && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            '&:hover': { color: 'primary.main' },
                                        }}
                                        onClick={() => setCurrentTab(2)}
                                    >
                                        <MapIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {entriesWithGps} positions GPS • Voir la carte →
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Preview */}
                    {journalEntries.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Dernières entrées
                                </Typography>
                                <Chip
                                    label="Voir tout"
                                    size="small"
                                    onClick={() => setCurrentTab(1)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                            <Stack spacing={1}>
                                {journalEntries.slice(0, 2).map((entry) => (
                                    <Card key={entry.id} variant="outlined">
                                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {entry.location || new Date(entry.entry_date).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short'
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
                                                        sx={{ ml: 1, height: 24 }}
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

                {/* Journal Tab */}
                <TabPanel value={currentTab} index={1}>
                    <JournalList entries={journalEntries} tripId={trip.id} onRefresh={onRefresh} />
                </TabPanel>

                {/* Map Tab */}
                <TabPanel value={currentTab} index={2}>
                    <TripMap
                        journalEntries={journalEntries}
                        media={media}
                        tripLat={trip.lat}
                        tripLng={trip.lng}
                    />
                </TabPanel>

                {/* Media Tab */}
                <TabPanel value={currentTab} index={3}>
                    <MediaGallery media={media} tripId={trip.id} />
                </TabPanel>

                {/* Expenses Tab */}
                <TabPanel value={currentTab} index={4}>
                    <ExpenseList expenses={expenses} tripId={trip.id} onRefresh={onRefresh} />
                </TabPanel>
            </Box>
        </Box>
    );
}
